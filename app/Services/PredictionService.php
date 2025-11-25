<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PredictionService
{
    private $apiUrl;

    public function __construct()
    {
        // Ambil URL dari .env - PREDICTION_API_URL
        $this->apiUrl = env('PREDICTION_API_URL', 'http://localhost:5000/predict');

        Log::info('PredictionService initialized', ['api_url' => $this->apiUrl]);
    }

    /**
     * Process individual answer and get prediction
     * 
     * @param \App\Models\Answers $answer
     * @param bool $useDummy
     * @return array
     */
    public function predictSingleAnswer($answer, $useDummy = false)
    {
        // Extract text from Lexical JSON format
        $text = $this->extractTextFromLexical($answer->jawaban);

        return $this->predict($text, $useDummy);
    }

    /**
     * Gabungkan semua jawaban dari user menjadi satu text panjang
     * NOTE: Deprecated - sekarang proses per jawaban individual
     */
    public function combineAnswers($answers)
    {
        $combinedText = '';

        foreach ($answers as $answer) {
            // Extract text from Lexical JSON format
            $text = $this->extractTextFromLexical($answer->jawaban);
            $combinedText .= $text . "\n\n";
        }

        return trim($combinedText);
    }

    /**
     * Extract plain text from Lexical JSON format
     */
    private function extractTextFromLexical($lexicalJson)
    {
        try {
            $data = json_decode($lexicalJson, true);

            if (!$data || !isset($data['root']['children'])) {
                // If not JSON, return as is
                return strip_tags($lexicalJson);
            }

            $text = '';
            $this->extractTextRecursive($data['root']['children'], $text);

            return $text;
        } catch (\Exception $e) {
            // Fallback to plain text
            return strip_tags($lexicalJson);
        }
    }

    /**
     * Recursively extract text from Lexical structure
     */
    private function extractTextRecursive($children, &$text)
    {
        foreach ($children as $child) {
            if (isset($child['type']) && $child['type'] === 'text') {
                $text .= $child['text'] . ' ';
            }

            if (isset($child['children']) && is_array($child['children'])) {
                $this->extractTextRecursive($child['children'], $text);
            }
        }
    }

    /**
     * Call prediction API
     * Untuk sementara return dummy data
     */
    public function predict($combinedText, $useDummy = false)
    {
        if ($useDummy) {
            Log::info('Using dummy prediction response');
            return $this->getDummyResponse();
        }

        Log::info('Calling prediction API', [
            'url' => $this->apiUrl,
            'text_length' => strlen($combinedText)
        ]);

        try {
            $startTime = microtime(true);

            $response = Http::timeout(10)->post($this->apiUrl, [
                'text' => $combinedText
            ]);

            $duration = microtime(true) - $startTime;
            Log::info('API call completed', ['duration' => round($duration, 2) . 's']);

            if ($response->successful()) {
                Log::info('Prediction successful');
                return $response->json();
            }

            Log::error('Prediction API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'url' => $this->apiUrl
            ]);

            // Fallback to dummy if API fails
            // return $this->getDummyResponse();
        } catch (\Exception $e) {
            Log::error('Prediction API Exception', [
                'message' => $e->getMessage()
            ]);

            // Fallback to dummy if API fails
            // return $this->getDummyResponse();
        }
    }

    /**
     * Get dummy response for testing
     */
    private function getDummyResponse()
    {
        return [
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
                'Pengembangan Diri Dan Orang Lain' => [
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
        ];
    }

    /**
     * Map API response dimension names to database column names
     */
    private function mapDimensionToColumn($dimensionName)
    {
        $mapping = [
            'Integritas' => 'integritas',
            'Kerja Sama' => 'kerja_sama',
            'Komunikasi' => 'komunikasi',
            'Orientasi Pada Hasil' => 'orientasi_pada_hasil',
            'Pelayanan Publik' => 'pelayanan_publik',
            'Pengembangan Diri Dan Orang Lain' => 'pengembangan_diri_dan_orang_lain',
            'Mengelola Perubahan' => 'mengelola_perubahan',
            'Pengambilan Keputusan' => 'pengambilan_keputusan',
            'Perekat Bangsa' => 'perekat_bangsa',
        ];

        return $mapping[$dimensionName] ?? strtolower(str_replace(' ', '_', $dimensionName));
    }

    /**
     * Save prediction results to TestResult model
     * Mengakumulasi scores dari multiple predictions
     */
    public function savePredictionResults($testResult, $predictions)
    {
        $updateData = ['is_predicted' => true];

        foreach ($predictions as $dimension => $data) {
            $columnName = $this->mapDimensionToColumn($dimension);

            // Save bot score
            $updateData['score_bot_' . $columnName] = $data['predicted_level'];

            // Save similarity score
            $updateData['similarity_' . $columnName] = $data['similarity_score'];
        }

        $testResult->update($updateData);

        return $testResult;
    }

    /**
     * Process all answers untuk satu test result dan average scores
     * 
     * @param \App\Models\TestResult $testResult
     * @param \Illuminate\Database\Eloquent\Collection $answers
     * @param bool $useDummy
     * @return void
     */
    public function processAllAnswers($testResult, $answers, $useDummy = false)
    {
        if ($answers->isEmpty()) {
            Log::warning('No answers to process for prediction', [
                'test_result_id' => $testResult->id
            ]);
            return;
        }

        // Accumulator untuk average scores
        $dimensionScores = [];
        $dimensionSimilarities = [];
        $totalAnswers = $answers->count();

        Log::info('Processing individual answers', [
            'test_result_id' => $testResult->id,
            'total_answers' => $totalAnswers
        ]);

        // Process setiap jawaban
        foreach ($answers as $index => $answer) {
            try {
                $prediction = $this->predictSingleAnswer($answer, $useDummy);

                if (isset($prediction['predictions'])) {
                    foreach ($prediction['predictions'] as $dimension => $data) {
                        $columnName = $this->mapDimensionToColumn($dimension);

                        // Akumulasi scores
                        if (!isset($dimensionScores[$columnName])) {
                            $dimensionScores[$columnName] = 0;
                            $dimensionSimilarities[$columnName] = 0;
                        }

                        $dimensionScores[$columnName] += $data['predicted_level'];
                        $dimensionSimilarities[$columnName] += $data['similarity_score'];
                    }
                }

                Log::info('Processed answer ' . ($index + 1) . '/' . $totalAnswers, [
                    'answer_id' => $answer->id
                ]);
            } catch (\Exception $e) {
                Log::error("Failed to process answer", [
                    'answer_id' => $answer->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Hitung average dan save
        $updateData = [
            'is_predicted' => true,
            'prediction_status' => 'completed',
            'prediction_completed_at' => now(),
            'prediction_error' => null // Clear any previous errors
        ];

        foreach ($dimensionScores as $columnName => $totalScore) {
            // Average score (rounded)
            $avgScore = round($totalScore / $totalAnswers);
            $updateData['score_bot_' . $columnName] = $avgScore;

            // Average similarity
            $avgSimilarity = $dimensionSimilarities[$columnName] / $totalAnswers;
            $updateData['similarity_' . $columnName] = $avgSimilarity;
        }

        $testResult->update($updateData);

        Log::info('Prediction completed with averaged scores', [
            'test_result_id' => $testResult->id,
            'status' => 'completed',
            'scores' => $updateData
        ]);
    }
}
