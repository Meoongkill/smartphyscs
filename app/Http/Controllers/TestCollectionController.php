<?php

namespace App\Http\Controllers;

use App\Models\Questions;
use App\Models\TestCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TestCollectionPivotQuestion;

class TestCollectionController extends Controller
{
    public function index()
    {
        $testCollection = TestCollection::where('is_active', true)->get();
        return Inertia::render('Admin/TestCollection/Index', [
            'testCollection' => $testCollection,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required',
        ]);

        // generate kode
        $kode = 'TEST-' . date('Ymd').rand(1000, 9999);

        TestCollection::create([
            'nama' => $request->nama,
            'kode' => $kode,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'message' => 'Paket berhasil ditambahkan.',
            'error' => false,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required',
        ]);

        $testCollection = TestCollection::where('id', $request->id)->first();

        if (!$testCollection) {
            return response()->json(
                [
                    'message' => 'Paket tidak ditemukan.',
                    'error' => true,
                ],
                404,
            );
        }

        $testCollection->update([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'message' => 'Paket berhasil diperbarui.',
            'error' => false,
        ]);
    }

    public function destroy(Request $request)
    {
        $testCollection = TestCollection::find($request->id);

        if (!$testCollection) {
            return response()->json([
                'message' => 'Paket tidak ditemukan.',
                'error' => true,
            ]);
        } else {
            $testCollection->update([
                'is_active' => 0,
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Paket berhasil dihapus.',
                'error' => false,
            ]);
        }
    }

    public function create($kode)
    {
        // show data question di page paket/addsoal
        $testCollection = TestCollection::where('kode', $kode)->where('is_active', true)->first();
        if (!$testCollection) {
            session()->flash('message', 'Paket tidak ditemukan.');
            session()->flash('type', 'error');
            return redirect()->route('admin.testCollection');
        }

        $questions = Questions::whereNotIn('id', function ($query) use ($testCollection) {
            $query
                ->select('question_id')
                ->from('test_collection_pivot_question')
                ->where('test_collection_id', $testCollection->id)
                ->where('is_active', true);
        })
            ->where('is_active', true)
            ->get();

        return Inertia::render('Admin/TestCollection/AddSoal', [
            'testCollection' => $testCollection,
            'questions' => $questions,
        ]);
    }

    public function showQuestionCollection($kode)
    {
        $testCollection = TestCollection::where('kode', $kode)->where('is_active', true)->first();
        if (!$testCollection) {
            session()->flash('message', 'Paket tidak ditemukan.');
            session()->flash('type', 'error');
            return redirect()->route('admin.testCollection');
        }

        $questions = TestCollectionPivotQuestion::where('test_collection_id', $testCollection->id)
            ->where('is_active', 1)
            ->with('question')
            ->get();

        return Inertia::render('Admin/TestCollection/DetailPaket', [
            'testCollection' => $testCollection,
            'questions' => $questions,
        ]);
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'requests' => 'required|array',
            'requests.*.test_collection_id' => 'required|exists:test_collections,id',
            'requests.*.question_id' => 'required|exists:questions,id',
        ]);

        foreach ($request->requests as $req) {
            $testCollection = TestCollection::find($req['test_collection_id']);
            if (!$testCollection) {
                $message = 'Paket tidak ditemukan.';
                continue;
            }

            $order = TestCollectionPivotQuestion::where('test_collection_id', $req['test_collection_id'])
                ->where('is_active', 1)
                ->orderBy('order', 'desc')
                ->first();

            $newOrder = $order ? $order->order + 1 : 1;

            TestCollectionPivotQuestion::create([
                'test_collection_id' => $req['test_collection_id'],
                'question_id' => $req['question_id'],
                'order' => $newOrder,
            ]);

            $message = 'Soal berhasil ditambahkan';
        }

        return response()->json([
            'message' => $message,
            'error' => false,
        ]);
    }

    public function deleteQuestion(Request $request)
    {
        // buat delete button di datatable paket/detail
        $testCollectionPivotQuestion = TestCollectionPivotQuestion::find($request->id);
        if (!$testCollectionPivotQuestion) {
            $message = 'Soal tidak ditemukan.';
        } else {
            $testCollectionPivotQuestion->update([
                'is_active' => 0,
                'updated_at' => now(),
            ]);
            $message = 'Soal berhasil dihapus dari Paket.';
        }
        
        return response()->json([
            'message' => $message,
            'error' => false,
        ]);
    }

    public function Detail($id)
    {
        $question = Questions::find($id);
        return Inertia::render('Admin/TestCollection/DetailSoal', ['data' => $question]);
    }
}
