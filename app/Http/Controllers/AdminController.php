<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Answers;
use Illuminate\Http\Request;
use App\Models\TestCollection;
use App\Models\Questions;
use App\Models\Session;
use Illuminate\Support\Str;
use GuzzleHttp\Client;
use App\Models\TestResult;
use Illuminate\Support\Facades\Auth;


class AdminController extends Controller
{
    public function users()
    {
        $usersWithAdminRole = User::whereHas('roles', function ($query) {
            $query->where('name', 'psikolog');
        })->with('roles')->get();
        return Inertia::render('Admin/Users', [
            'users' => $usersWithAdminRole
        ]);
    }
    public function dashboard()
    {
        $paket = TestCollection::where('is_active', true)->with(['pivotQuestions.question'])->get();
        $session = Session::where('is_active', true)->get();
        return Inertia::render('Admin/SesiTes/Index', [
            'session' => $session,
            'paket' => $paket
        ]);
    }

    public function detailTest($kode)
    {
        $test = TestCollection::orderBy('kode', 'desc')->first()->with('questions')->get();
        $question = Questions::where('test_id', $id)->get();
        return Inertia::render('Admin/Detail', [
            'test' => $test,
            'question' => $question,
        ]);
    }

    public function hasilTest($id)
    {
        $test = TestCollection::where('id', $id)->with('results.users')->get();
        return Inertia::render('Admin/HasilTes', [
            'id' => $id,
            'test' => $test,
        ]);
    }

    public function createNewPaket(Request $request)
    {
        // $uniqueId = Str::random(3) . strtoupper(Str::random(3));
        // dd($uniqueId);
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required',
        ]);

        // dd($request->input('tanggal'));
        TestCollection::create([
            'nama' => $request->input('nama'),
            'deskripsi' => $request->input('deskripsi')
            // Use the generated unique ID as needed
        ]);
        // Mengambil data yang baru saja dibuat
        return redirect()->back();
    }

    public function DeleteTestCollection(Request $request)
    {
        TestCollection::destroy($request['id']);
        return redirect()->route('admin.dashboard')->with('success', 'Data Berhasil Dihapus!');
    }
    public function DeleteSoal(Request $request)
    {
        // Fetch the id before deleting the question
        $question = Questions::find($request['id']);

        // Delete the question
        Questions::destroy($request['id']);

        // Check if the question was found before redirecting
        if ($question) {
            // Redirect to admin.detail with the id parameter
            return redirect()->route('admin.detail', ['id' => $question->id])->with('success', 'Data Berhasil Dihapus!');
        } else {
            // Handle the case where the question was not found
            return redirect()->route('admin.detail')->with('error', 'Question not found!');
        }
    }


    public function createNewQuestion(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required',
            'dimensi' => 'required',
            // 'attachment' => 'required',
        ]);
        // dd($request);
        Questions::create([
            'pertanyaan' => $request->input('pertanyaan'),
            'dimensi' => $request->input('dimensi'),
            // 'attachment' => $request->input('attachment'),
        ]);

        // Mengambil data yang baru saja dibuat
        return redirect()->back();
    }
    public function deleteTest(Request $request)
    {
        TestCollection::destroy($request['id']);
        return redirect()->route('admin-materi')->with('success', 'Data Berhasil Dihapus!');
    }
    public function models()
    {
        $usersWithAdminRole = User::whereHas('roles', function ($query) {
            $query->where('name', 'psikolog');
        })->with('roles')->get();
        return Inertia::render('Admin/Models', [
            'users' => $usersWithAdminRole
        ]);
    }

    public function predictTest(Request $request)
    {
        $testResults = TestResult::where('test_id', $request->id)->get();
        $answers = Answers::wherein('result_id', $testResults->pluck('id'))->get();
        $formattedData = [];
        foreach ($answers as $item) {
            $formattedData[] = [
                'id' => $item->id,
                'dimensi' => $item->question->dimensi,
                'jawaban' => $item->jawaban,
            ];
        }
        $batch = ['batch' => $formattedData];
        $client = new Client();

        try {
            $response = $client->post('http://localhost:8080/predict', [
                'json' => $batch,
            ]);
            $apiResponse = json_decode($response->getBody(), true);
            foreach ($apiResponse as $item) {
                $id = $item['id'];
                $skor = $item['label'];
                Answers::where('id', $id)->update(['skor' => $skor]);
            }
            // Simpan pesan sukses dalam session
            session()->flash('success', 'Berhasil predict');

            TestResult::where('test_id', $request->id)->update(['is_predicted' => true]);
        } catch (\Exception $e) {
            // Handle exceptions (e.g., connection issues, server errors)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function resultDetail($id, $test_id)
    {
        $listresult = TestResult::where('test_id', $test_id)->get();
        $userIds = $listresult->pluck('user_id')->toArray();
        $testIds = $listresult->pluck('test_id')->toArray();
        $endpoint = array_map(function ($userId, $testId) {
            return "$userId/$testId";
        }, $userIds, $testIds);

        $result = TestResult::where('user_id', $id)->where('test_id', $test_id)->with('users')->first();
        $questions = Questions::where('test_id', $test_id)->get();
        $answers = Answers::where('result_id', $result->id)->whereIn('question_id', $questions->pluck('id'))->get();
        return Inertia::render('Admin/DetailHasilTes', [
            'result' => $result,
            'questions' => $questions,
            'answers' => $answers,
            'endpoints' => $endpoint,
        ]);
    }

    public function updatePaket(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required'
        ]);
        TestCollection::where('id', $request->id)->update([
            'nama' => $request->input('nama'),
            'deskripsi' => $request->input('deskripsi')
        ]);
        return redirect()->back();
    }

    public function updateQuestion(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required',
            'dimensi' => 'required',
        ]);
        Questions::where('id', $request->id)->update([
            'pertanyaan' => $request->input('pertanyaan'),
            'dimensi' => $request->input('dimensi'),
        ]);
        return redirect()->back();
    }

    public function manajemenUser()
    {
        return Inertia::render('Admin/KelolaUser/Index');
    }
}
