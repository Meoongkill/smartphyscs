<?php

namespace App\Http\Controllers;

use App\Models\Answers;
use App\Models\TestResult;
use App\Models\User;
use App\Models\Session;
use App\Models\EnrolledTest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class Psikolog2Controller extends Controller
{
    /**
     * Display list of psychology sessions
     */
    public function index()
    {
        $user = auth()->user();

        // Get sessions yang di-assign ke psikolog ini
        $sessions = $user->assignedSessions()
            ->select('sessions.id', 'sessions.name', 'sessions.description', 'sessions.start_date', 'sessions.end_date', 'sessions.code')
            ->where('sessions.is_active', true)
            ->withCount('testResults as participants_count')
            ->get();

        return Inertia::render('Psikolog2/psikolog', [
            'sessions' => $sessions,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Display participants for a specific session
     */
    public function peserta($sessionId)
    {
        $session = Session::findOrFail($sessionId);

        // Get unique participants from test results for this session
        $testResults = TestResult::where('session_id', $sessionId)
            ->with('users')
            ->get()
            ->unique('user_id');

        $participants = [];
        foreach ($testResults as $testResult) {
            $user = $testResult->users;
            if ($user) {
                $totalQuestions = Answers::whereHas('testResult', function ($query) use ($sessionId, $user) {
                    $query->where('session_id', $sessionId)
                        ->where('user_id', $user->id);
                })->count();

                $totalAnswers = Answers::whereHas('testResult', function ($query) use ($sessionId, $user) {
                    $query->where('session_id', $sessionId)
                        ->where('user_id', $user->id);
                })->whereNotNull('jawaban')->count();

                $participants[] = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'photo' => '/images/default-avatar.png',
                    'bio' => $user->bio ?? $user->email,
                    'verified' => $user->email_verified_at !== null,
                    'total_questions' => $totalQuestions,
                    'total_answers' => $totalAnswers,
                ];
            }
        }

        return Inertia::render('Psikolog2/peserta-sesi', [
            'participants' => $participants,
            'session' => $session,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Display participant answers for scoring
     */
    public function jawaban($sessionId, $userId)
    {
        $session = Session::findOrFail($sessionId);
        $user = User::findOrFail($userId);

        // Get prediction service
        $predictionService = new \App\Services\PredictionService();

        // Get test results with answers
        $testResults = TestResult::where('session_id', $sessionId)
            ->where('user_id', $userId)
            ->with(['answers.question'])
            ->get();

        $questions = [];
        foreach ($testResults as $testResult) {
            foreach ($testResult->answers as $answer) {
                if ($answer->question) {
                    // Predict single answer to get scores per dimension
                    $prediction = $predictionService->predictSingleAnswer($answer, true);

                    // Extract scores from prediction
                    $scores = [];
                    if (isset($prediction['predictions'])) {
                        foreach ($prediction['predictions'] as $dimension => $data) {
                            $scores[$dimension] = [
                                'rekomendasi' => $data['predicted_level'] ?? 0,
                                'psikolog' => $data['predicted_level'] ?? 0 // Default sama dengan rekomendasi, bisa diedit
                            ];
                        }
                    }

                    $questions[] = [
                        'id' => $answer->id,
                        'question' => $answer->question->pertanyaan ?? $answer->question->question ?? '',
                        'answer' => $answer->jawaban ?? '',
                        'scores' => $scores
                    ];
                }
            }
        }

        return Inertia::render('Psikolog2/jawaban-sesi', [
            'questions' => $questions,
            'user' => $user,
            'session' => $session,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Save psychologist scores
     */
    public function saveScores(Request $request)
    {
        Log::info('=== INCOMING REQUEST ===');
        Log::info('All request data:', $request->all());
        Log::info('Request input:', $request->input());
        Log::info('Has scores?', ['has' => $request->has('scores')]);
        Log::info('Scores value:', ['scores' => $request->input('scores')]);

        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'session_id' => 'required|exists:sessions,id',
                'scores' => 'required|array',
                'scores.*.question_id' => 'required|exists:answers,id',
                'scores.*.sentimen' => 'required|string',
                'scores.*.score' => 'required|min:0|max:100'
            ]);
        } catch (\Exception $e) {
            Log::error('Validation error:', ['error' => $e->getMessage()]);
            throw $e;
        }

        DB::beginTransaction();
        try {
            // Group scores by test_result_id and dimension
            $testResultScores = [];

            foreach ($request->scores as $scoreData) {
                $answer = Answers::find($scoreData['question_id']);
                if ($answer) {
                    // Store psychologist score in answers table (keep for backward compatibility)
                    $answer->score_psikolog = (int) $scoreData['score'];
                    $answer->save();

                    // Group by test result and dimension
                    $testResultId = $answer->test_result_id;
                    $dimension = $scoreData['sentimen'];

                    if (!isset($testResultScores[$testResultId])) {
                        $testResultScores[$testResultId] = [];
                    }
                    if (!isset($testResultScores[$testResultId][$dimension])) {
                        $testResultScores[$testResultId][$dimension] = ['scores' => [], 'count' => 0];
                    }

                    $testResultScores[$testResultId][$dimension]['scores'][] = (int) $scoreData['score'];
                    $testResultScores[$testResultId][$dimension]['count']++;
                }
            }

            // Update test results with averaged psychologist scores per dimension
            foreach ($testResultScores as $testResultId => $dimensions) {
                $testResult = TestResult::find($testResultId);
                if ($testResult) {
                    foreach ($dimensions as $dimension => $data) {
                        // Calculate average score for this dimension
                        $avgScore = array_sum($data['scores']) / $data['count'];

                        // Map dimension name to column name
                        $columnName = $this->mapDimensionToColumn($dimension);
                        if ($columnName) {
                            $testResult->{"score_human_" . $columnName} = round($avgScore);
                        }
                    }
                    $testResult->save();
                }
            }

            DB::commit();

            // Return success response - frontend will handle navigation
            return back()->with('success', 'Nilai berhasil disimpan');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Save scores error: ' . $e->getMessage());
            Log::error('Request data: ' . json_encode($request->all()));

            return back()->withErrors([
                'error' => 'Failed to save scores: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display final results
     */
    public function hasilAkhir($sessionId, $userId)
    {
        $session = Session::findOrFail($sessionId);
        $user = User::findOrFail($userId);

        // Calculate total scores
        $testResults = TestResult::where('session_id', $sessionId)
            ->where('user_id', $userId)
            ->get();

        $totalScoreBot = $testResults->sum('score_bot') ?? 0;
        $totalScorePsikolog = $testResults->sum('score_human') ?? 0;

        // Calculate progress percentage (using psychologist score if available, otherwise bot score)
        $maxScore = 100 * $testResults->count(); // Assuming max 100 per test
        $actualScore = $totalScorePsikolog > 0 ? $totalScorePsikolog : $totalScoreBot;
        $progress = $maxScore > 0 ? round(($actualScore / $maxScore) * 100) : 0;

        $result = [
            'progress' => $progress,
            'score' => $actualScore,
            'max_score' => $maxScore,
            'vacancy' => $session->name
        ];

        return Inertia::render('Psikolog2/hasil-akhir', [
            'result' => $result,
            'user' => $user,
            'session' => $session
        ]);
    }

    /**
     * Display report page (new report index)
     */
    public function report($sessionId, $userId)
    {
        $session = Session::findOrFail($sessionId);
        $user = User::findOrFail($userId);

        // For now the frontend Report-index.jsx contains its own sample data.
        // We still pass the session and user so the page can be extended later.
        return Inertia::render('Psikolog2/Report-index', [
            'session' => $session,
            'user' => $user
        ]);
    }

    /**
     * Display personal report page
     */
    public function reportPersonal($sessionId, $userId)
    {
        $session = Session::findOrFail($sessionId);
        $user = User::findOrFail($userId);

        // Get all test results for this user in this session
        $testResults = TestResult::where('session_id', $sessionId)
            ->where('user_id', $userId)
            ->with('answers')
            ->get();

        // Calculate scores per dimension using the formula:
        // For each dimension: average of ((score_bot + score_human) / 2) across all questions
        $dimensions = [
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

        $scores = [];
        foreach ($dimensions as $dimensionName => $columnName) {
            $botScoreTotal = 0;
            $humanScoreTotal = 0;
            $count = 0;

            // Get scores from test_results table
            foreach ($testResults as $result) {
                $botVal = $result->{"score_bot_" . $columnName} ?? 0;
                $humanVal = $result->{"score_human_" . $columnName};

                // If human score is null, use bot score as default
                if ($humanVal === null || $humanVal === '') {
                    $humanVal = $botVal;
                }

                $botScoreTotal += $botVal;
                $humanScoreTotal += $humanVal;
                $count++;
            }

            // Calculate average scores
            $botScore = $count > 0 ? round($botScoreTotal / $count, 2) : 0;
            $humanScore = $count > 0 ? round($humanScoreTotal / $count, 2) : 0;
            $finalScore = round(($botScore + $humanScore) / 2, 2);

            $scores[] = [
                'dimension' => $dimensionName,
                'recommended' => $botScore,
                'psychologist' => $humanScore,
                'final' => $finalScore
            ];
        }

        return Inertia::render('Psikolog2/Report-Personal', [
            'session' => [
                'id' => $session->id,
                'name' => $session->name,
                'code' => $session->code,
                'sessionNumber' => $session->id
            ],
            'user' => [
                'id' => $user->id,
                'fullName' => $user->name,
                'nik' => $user->nik,
                'email' => $user->email,
                'phone' => $user->nohp,
                'address' => $user->alamat,
                'photo' => $user->foto ? asset('foto/' . $user->foto) : null,
            ],
            'reportData' => [
                'id' => $user->id,
                'fullName' => $user->name,
                'nik' => $user->nik,
                'email' => $user->email,
                'phone' => $user->nohp,
                'address' => $user->alamat,
                'age' => null, // Calculate from birth date if available
                'dateOfBirth' => null, // Add if field exists
                'sex' => null, // Add if field exists
                'session' => $session->name,
                'sessionCode' => $session->code,
                'sessionNumber' => $session->id,
                'examinationDate' => $session->start_date,
                'psychologist' => auth()->user()->name,
                'psychologistPhoto' => auth()->user()->foto ? asset('foto/' . auth()->user()->foto) : null,
                'psychologistSignature' => auth()->user()->signature ? asset('storage/' . auth()->user()->signature) : null,
                'scores' => $scores,
                'date' => now()->format('d F Y')
            ]
        ]);
    }

    /**
     * Display report index for a session (aggregate)
     */
    public function reportIndex($sessionId)
    {
        $session = Session::findOrFail($sessionId);

        // Get all enrolled users for this session
        $enrolledTests = EnrolledTest::where('session_id', $sessionId)
            ->with('user')
            ->get();

        $dimensions = [
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

        $participants = [];
        foreach ($enrolledTests as $enrolled) {
            $user = $enrolled->user;
            if (!$user) continue;

            // Get test results for this user
            $testResults = TestResult::where('session_id', $sessionId)
                ->where('user_id', $user->id)
                ->get();

            if ($testResults->isEmpty()) continue;

            // Calculate scores per dimension
            $userScores = [];
            foreach ($dimensions as $dimensionName => $columnName) {
                $botTotal = 0;
                $humanTotal = 0;
                $count = 0;

                foreach ($testResults as $result) {
                    $botVal = $result->{"score_bot_" . $columnName} ?? 0;
                    $humanVal = $result->{"score_human_" . $columnName};

                    // If human score is null, use bot score
                    if ($humanVal === null || $humanVal === '') {
                        $humanVal = $botVal;
                    }

                    $botTotal += $botVal;
                    $humanTotal += $humanVal;
                    $count++;
                }

                // Calculate average and final score
                $botAvg = $count > 0 ? round($botTotal / $count, 2) : 0;
                $humanAvg = $count > 0 ? round($humanTotal / $count, 2) : 0;
                $finalScore = round(($botAvg + $humanAvg) / 2, 2);

                $userScores[$columnName] = $finalScore;
            }

            $participants[] = [
                'id' => $user->id,
                'name' => $user->name,
                'integritas' => $userScores['integritas'] ?? 0,
                'kerjasama' => $userScores['kerja_sama'] ?? 0,
                'komunikasi' => $userScores['komunikasi'] ?? 0,
                'orientasi' => $userScores['orientasi_pada_hasil'] ?? 0,
                'pelayanan' => $userScores['pelayanan_publik'] ?? 0,
                'pengembangan' => $userScores['pengembangan_diri_dan_orang_lain'] ?? 0,
                'mengelola' => $userScores['mengelola_perubahan'] ?? 0,
                'pengambilan' => $userScores['pengambilan_keputusan'] ?? 0,
                'perekat' => $userScores['perekat_bangsa'] ?? 0,
            ];
        }

        $user = auth()->user();

        return Inertia::render('Psikolog2/Report-index', [
            'session' => [
                'id' => $session->id,
                'name' => $session->name,
                'code' => $session->code,
                'description' => $session->description,
                'examinationDate' => $session->start_date,
                'psychologist' => $user->name,
                'psychologistPhoto' => $user->foto ? asset('foto/' . $user->foto) : null,
                'psychologistSignature' => $user->signature ? asset('storage/' . $user->signature) : null,
                'date' => now()->format('d F Y')
            ],
            'participants' => $participants,
        ]);
    }

    /**
     * Map dimension name to database column name
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

        return $mapping[$dimensionName] ?? null;
    }
}
