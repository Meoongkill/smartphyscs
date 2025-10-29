<?php

namespace App\Http\Controllers;

use App\Models\EnrolledTest;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Session;
use App\Models\User;
use App\Models\SessionsPivotTestCollection;
use App\Models\TestCollection;

use function Laravel\Prompts\select;

class SessionController extends Controller
{
    public function index()
    {
        $paket = TestCollection::where('is_active', true)->with(['pivotQuestions.question'])->get();
        $session = Session::where('is_active', true)->get();
        return Inertia::render('Admin/SesiTes/Index', [
            'session' => $session,
            'paket' => $paket
        ]);
    }

    public function detail($kode)
    {
        $session = Session::with('testCollections.testCollection.pivotQuestions.question')
            ->where('code', $kode)->where('is_active', true)->first();
        $test_results = TestResult::where('session_id', $session->id)->with('answers')->with('users')->get();
        $testCollection = TestCollection::where('is_active', true)->get();
        // Group test results by user_id and sum the scores
        $userScores = [];
        foreach ($test_results as $test_result) {
            $userId = $test_result->user_id;
            if (!isset($userScores[$userId])) {
                $userScores[$userId] = [
                    'id' => $test_result->users->id,
                    'name' => $test_result->users->name,
                    'nik' => $test_result->users->nik,
                    'email' => $test_result->users->email,
                    'total_score_bot' => 0,
                    'total_score_psikolog' => 0,
                    'answers' => []
                ];
            }
            $score_bot = $test_result->score_bot ? $test_result->score_bot : 0;
            $score_psikolog = $test_result->score_human ? $test_result->score_human : 0;
            $userScores[$userId]['total_score_bot'] += $score_bot;
            $userScores[$userId]['total_score_psikolog'] += $score_psikolog;
            array_push($userScores[$userId]['answers'], ...$test_result->answers);
        }

        return Inertia::render('Admin/SesiTes/DetailSession', [
            'session' => $session,
            'testCollection' => $testCollection,
            'user_result' => array_values($userScores),
        ]);
    }


    public function detail_jawaban($code, $user_id)
    {
        $session = Session::with('testCollections.testCollection')
            ->where('code', $code)->where('is_active', true)->first();

        $test_results = TestResult::where('user_id', $user_id)
            ->where('session_id', $session->id)
            ->with('answers.question')
            ->get();

        $user = User::find($user_id);

        unset($session->id);

        return Inertia::render('Admin/SesiTes/DetailJawaban', [
            'session' => $session,
            'test_results' => $test_results,
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'duration_1' => 'required',
            'duration_2' => 'required',
            'duration_3' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'test_collections.*.test_collection_id' => 'exists:test_collections,id',
        ]);
        $session = Session::create([
            'name' => $request->name,
            'description' => $request->description,
            'duration_1' => $request->duration_1,
            'duration_2' => $request->duration_2,
            'duration_3' => $request->duration_3,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'code' => bin2hex(random_bytes(8)),
        ]);

        if ($request->test_collections) {
            foreach ($request->test_collections as $req) {
                SessionsPivotTestCollection::create([
                    'session_id' => $session->id,
                    'test_collection_id' => $req['test_collection_id'],
                ]);
            }
        }

        return response()->json(['message' => 'Sesi berhasil ditambahkan.']);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'duration_1' => 'required',
            'duration_2' => 'required',
            'duration_3' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        Session::where('id', $request->id)->update([
            'name' => $request->name,
            'description' => $request->description,
            'duration_1' => $request->duration_1,
            'duration_2' => $request->duration_2,
            'duration_3' => $request->duration_3,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        if ($request->test_collections) {
            SessionsPivotTestCollection::where('session_id', $request->id)->delete();

            foreach ($request->test_collections as $req) {
                SessionsPivotTestCollection::create([
                    'session_id' => $request->id,
                    'test_collection_id' => $req['test_collection_id'],
                ]);
            }
        }

        return response()->json(['message' => 'Sesi berhasil diupdate.', 'kode' => $request->kode]);
    }

    public function destroy(Request $request)
    {
        $session = Session::find($request->id);
        if (!$session) {
            $message = 'Sesi tidak ditemukan.';
        } else {
            $session->update([
                'is_active' => 0,
                'updated_at' => now()
            ]);
            $message = 'Sesi berhasil dihapus.';
        }

        return response()->json(['message' => $message]);
    }

    public function storeCollection(Request $request)
    {
        $request->validate([
            'requests' => 'required|array',
            'requests.*.session_id' => 'required|exists:sessions,id',
            'requests.*.test_collection_id' => 'required|exists:test_collections,id',
        ]);

        $messages = [];
        foreach ($request->requests as $req) {
            SessionsPivotTestCollection::create([
                'session_id' => $req['session_id'],
                'test_collection_id' => $req['test_collection_id'],
            ]);
            $messages[] = 'Koleksi dengan ID ' . $req['test_collection_id'] . ' berhasil ditambahkan ke Session dengan ID ' . $req['session_id'] . '.';
        }

        session()->flash('messages', $messages);
        session()->flash('type', 'success');
        return redirect()->route('admin.session');
    }


    public function deleteCollection(Request $request)
    {
        $collection = SessionsPivotTestCollection::find($request->id);
        if (!$collection) {
            session()->flash('message', 'Koleksi tidak ditemukan.');
            session()->flash('type', 'error');
            return redirect()->route('admin.session');
        } else {
            $collection->delete();
        }
        session()->flash('message', 'Koleksi berhasil dihapus.');
        session()->flash('type', 'success');
        return redirect()->route('admin.session');
    }

    public function sessionParticipant($id)
    {
        // Find the session by ID and return 404 if not found
        $session = Session::findOrFail($id);

        // Fetch enrolled users for the session with eager loading the user relationship
        $sessionParticipants = EnrolledTest::where('session_id', $id)->with('user')->get();

        // Render the view with session and its participants
        return Inertia::render('Admin/SesiTes/SessionParticipant', [
            'session' => $session,
            'sessionParticipants' => $sessionParticipants,
        ]);
    }

    // create session participant
    public function createSessionParticipant($id)
    {
        // Find the session by ID
        $session = Session::find($id);

        if (!$session) {
            session()->flash('message', 'Sesi tidak ditemukan.');
            session()->flash('type', 'error');
            return redirect()->route('admin.session');
        }

        // Get users who have not enrolled in the session and whose role is 'user'
        $users = User::whereDoesntHave('enrolledTests', function ($query) use ($id) {
            $query->where('session_id', $id);
        })->whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })->get();
        return Inertia::render('Admin/SesiTes/CreateSessionParticipant', [
            'session' => $session,
            'users' => $users
        ]);
    }


    // store user to session
    public function storeSessionParticipant(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'users.*.session_id' => 'required|exists:sessions,id',
            'users.*.user_id' => 'required|exists:users,id',
        ]);

        $messages = [];
        $session_id = null;
        foreach ($request->users as $req) {
            // Check if the user is already enrolled in the session
            $existingEnrollment = EnrolledTest::where('session_id', $req['session_id'])
                ->where('user_id', $req['user_id'])
                ->exists();
            $session_id = $req['session_id'];

            if (!$existingEnrollment) {
                EnrolledTest::create([
                    'session_id' => $req['session_id'],
                    'user_id' => $req['user_id'],
                ]);
                $messages[] = "User ID {$req['user_id']} berhasil ditambahkan ke Sesi ID {$req['session_id']}.";
            } else {
                $messages[] = "User ID {$req['user_id']} sudah terdaftar di Sesi ID {$req['session_id']}.";
            }
        }
        $session = Session::find($session_id);

        return response()->json(['message' => 'Peserta berhasil ditambahkan ke sesi.', 'kode' => $session->code]);
    }


    // delete user from session
    public function deleteSessionParticipant(Request $request)
    {
        $participant = EnrolledTest::find($request->id);
        if (!$participant) {
            session()->flash('message', 'Peserta tidak ditemukan.');
            session()->flash('type', 'error');
            return redirect()->route('admin.session');
        } else {
            $participant->delete();
        }
        session()->flash('message', 'Peserta berhasil dihapus.');
        session()->flash('type', 'success');
        return redirect()->route('admin.session');
    }
}
