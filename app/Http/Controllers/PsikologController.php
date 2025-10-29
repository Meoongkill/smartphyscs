<?php

namespace App\Http\Controllers;

use App\Models\Answers;
use App\Models\TestResult;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TestCollection;
use App\Models\Questions;
use App\Models\Answer;
use App\Models\Session;
use Illuminate\Support\Facades\DB;

class PsikologController extends Controller
{
    public function index()
    {
        $session = Session::select('id', 'name', 'description', 'start_date', 'end_date', 'code')->where('is_active', true)->get();
        return Inertia::render('Psikolog/Dashboard', [
            'session' => $session
        ]);
    }

    public function show($id)
    {
        $session = Session::findOrFail($id);
        $test_results = TestResult::where('session_id', $session->id)
            ->with('users')
            ->get();
        $userScores = [];
        foreach ($test_results as $test_result) {
            $userId = $test_result->user_id;
            if (!isset($userScores[$userId])) {
                $userScores[$userId] = [
                    'id' => $test_result->users->id,
                    'name' => $test_result->users->name,
                    'total_score_bot' => 0,
                    'total_score_psikolog' => 0
                ];
            }
            $score_bot = $test_result->score_bot ? $test_result->score_bot : 0;
            $score_psikolog = $test_result->score_human ? $test_result->score_human : 0;
            $userScores[$userId]['total_score_bot'] += $score_bot;
            $userScores[$userId]['total_score_psikolog'] += $score_psikolog;
        }

        return Inertia::render('Psikolog/HasilTes', [
            'session' => $session,
            'user_result' => array_values($userScores),
        ]);
    }

    public function users()
    {
        return Inertia::render('Psikolog/Users', [
            'users' => User::all(),
        ]);
    }

    public function result($user_id, $session_id)
    {
        // get all test result data by user id and session id
        $test_results = TestResult::where('user_id', $user_id)
            ->where('session_id', $session_id)
            ->with('users')
            ->with('answers.question')
            ->get();

        $user = User::find($user_id);

        $session = Session::select('id', 'name', 'description', 'start_date', 'end_date', 'code')->where('id', $session_id)->get();
        return Inertia::render('Psikolog/DetailHasilTes', [
            'test_results' => $test_results,
            'user' => $user,
            'session' => $session,
        ]);
    }

    public function resultDetail($id, $session_id)
    {
        // $listresult = TestResults::where('test_id', $test_id)->get();
        // $userIds = $listresult->pluck('user_id')->toArray();
        // $testIds = $listresult->pluck('test_id')->toArray();
        // $endpoint = array_map(function ($userId, $testId) {
        //     return "$userId/$testId";
        // }, $userIds, $testIds);

        // $result = TestResults::where('user_id', $id)->where('test_id', $test_id)->with('users')->first();
        // $questions = Questions::where('test_id', $test_id)->get();
        // $answers = Answers::where('result_id', $result->id)->whereIn('question_id', $questions->pluck('id'))->get();
        $session = Session::where('id', $session_id)->get();
        return Inertia::render('Psikolog/DetailHasilTes', [
            'session' => $session
            // 'result' => $result,
            // 'questions' => $questions,
            // 'answers' => $answers,
            // 'endpoints' => $endpoint,
        ]);
    }

    public function storeScore(Request $request)
    {

        $request->validate([
            'scores' => 'required|array',
            'scores.*.id' => 'required|exists:answers,id', // Ensure each item has an ID that exists in the answers table
            'scores.*.skor_psikolog' => 'required'
        ]);

        $testResultScores = [];

        // table answers
        foreach ($request->scores as $score) {
            $answer = Answers::find($score['id']);
            if ($answer) {
                $answer->score_psikolog = $score['skor_psikolog'];
                $answer->save();

                if (!isset($testResultScores[$answer->test_result_id])) {
                    $testResultScores[$answer->test_result_id] = 0;
                }
                $testResultScores[$answer->test_result_id] += $answer->score_psikolog;
            }
        }

        // table test result
        foreach ($testResultScores as $testResultId => $totalSkorPsikolog) {
            $testResult = TestResult::find($testResultId);
            if ($testResult) {
                $testResult->score_human = $totalSkorPsikolog;
                $testResult->save();
            }
        }

        // Return a success response
        return response()->json([
            'message' => 'Semua skor berhasil disimpan.',
            'error' => false,
        ]);
    }
}
