<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PredictionService;
use App\Models\TestResult;
use App\Models\Answers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PredictionController extends Controller
{
    protected $predictionService;

    public function __construct()
    {
        $this->predictionService = new PredictionService();
    }

    /**
     * Predict single text
     * 
     * POST /api/predict
     * Body: { "text": "Jawaban peserta..." }
     */
    public function predictSingle(Request $request)
    {
        $request->validate([
            'text' => 'required|string'
        ]);

        try {
            $text = $request->input('text');
            $prediction = $this->predictionService->predict($text, true); // true = use dummy

            return response()->json([
                'success' => true,
                'data' => $prediction
            ]);
        } catch (\Exception $e) {
            Log::error('Prediction API Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Prediction failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Predict batch texts
     * 
     * POST /api/predict/batch
     * Body: { "texts": ["Jawaban 1", "Jawaban 2", ...] }
     */
    public function predictBatch(Request $request)
    {
        $request->validate([
            'texts' => 'required|array',
            'texts.*' => 'required|string'
        ]);

        try {
            $texts = $request->input('texts');
            $predictions = [];

            foreach ($texts as $index => $text) {
                $prediction = $this->predictionService->predict($text, true);
                $predictions[] = [
                    'index' => $index,
                    'text_preview' => substr($text, 0, 100) . '...',
                    'prediction' => $prediction
                ];
            }

            return response()->json([
                'success' => true,
                'total_texts' => count($texts),
                'data' => $predictions
            ]);
        } catch (\Exception $e) {
            Log::error('Batch Prediction API Error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Batch prediction failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Predict all answers for a test result
     * 
     * POST /api/predict/test-result/{testResultId}
     */
    public function predictTestResult($testResultId)
    {
        try {
            $testResult = TestResult::findOrFail($testResultId);

            // Get all answers for this test result and related answers from same session
            $allAnswers = Answers::whereHas('testResult', function ($query) use ($testResult) {
                $query->where('user_id', $testResult->user_id)
                    ->where('session_id', $testResult->session_id);
            })->get();

            if ($allAnswers->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No answers found for this test result'
                ], 404);
            }

            Log::info('Processing prediction for test result', [
                'test_result_id' => $testResultId,
                'total_answers' => $allAnswers->count()
            ]);

            // Process all answers
            $this->predictionService->processAllAnswers($testResult, $allAnswers, true);

            // Reload test result to get updated scores
            $testResult->refresh();

            // Format response
            $dimensions = [
                'integritas' => 'Integritas',
                'kerja_sama' => 'Kerja Sama',
                'komunikasi' => 'Komunikasi',
                'orientasi_pada_hasil' => 'Orientasi Pada Hasil',
                'pelayanan_publik' => 'Pelayanan Publik',
                'pengembangan_diri_dan_orang_lain' => 'Pengembangan Diri dan Orang Lain',
                'mengelola_perubahan' => 'Mengelola Perubahan',
                'pengambilan_keputusan' => 'Pengambilan Keputusan',
                'perekat_bangsa' => 'Perekat Bangsa',
            ];

            $results = [];
            foreach ($dimensions as $key => $name) {
                $results[$name] = [
                    'predicted_level' => $testResult->{'score_bot_' . $key},
                    'similarity_score' => $testResult->{'similarity_' . $key},
                ];
            }

            return response()->json([
                'success' => true,
                'test_result_id' => $testResultId,
                'user_id' => $testResult->user_id,
                'session_id' => $testResult->session_id,
                'is_predicted' => $testResult->is_predicted,
                'total_answers_processed' => $allAnswers->count(),
                'predictions' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Test Result Prediction Error', [
                'test_result_id' => $testResultId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Prediction failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dummy prediction response (for testing)
     * 
     * GET /api/predict/dummy
     */
    public function getDummy()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'predictions' => [
                    'Integritas' => [
                        'predicted_level' => 4,
                        'similarity_score' => 0.8490171432495117
                    ],
                    'Kerja Sama' => [
                        'predicted_level' => 4,
                        'similarity_score' => 0.8115060329437256
                    ],
                    'Komunikasi' => [
                        'predicted_level' => 3,
                        'similarity_score' => 0.6328724026679993
                    ],
                    'Orientasi Pada Hasil' => [
                        'predicted_level' => 3,
                        'similarity_score' => 0.5719488263130188
                    ],
                    'Pelayanan Publik' => [
                        'predicted_level' => 3,
                        'similarity_score' => 0.6091981530189514
                    ],
                    'Pengembangan Diri dan Orang Lain' => [
                        'predicted_level' => 4,
                        'similarity_score' => 0.8171096444129944
                    ],
                    'Mengelola Perubahan' => [
                        'predicted_level' => 4,
                        'similarity_score' => 0.6122919917106628
                    ],
                    'Pengambilan Keputusan' => [
                        'predicted_level' => 3,
                        'similarity_score' => 0.6324744820594788
                    ],
                    'Perekat Bangsa' => [
                        'predicted_level' => 3,
                        'similarity_score' => 0.6451516151428223
                    ]
                ]
            ]
        ]);
    }
}
