<?php

namespace App\Http\Controllers;

use App\Models\Questions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuestionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = Questions::where('is_active', true)->orderBy('kode')->get();
        // dd($questions);
        return Inertia::render('Admin/Banksoal/Index', [
            'questions' => $questions,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function create()
    {
        return Inertia::render('Admin/Banksoal/Create');
    }

    public function edit($kode)
    {
        $question = Questions::where('kode', $kode)->where('is_active', true)->first();
        return Inertia::render('Admin/Banksoal/Create', [
            'question' => $question,
        ]);
        // return redirect()->route('admin.bankSoal');
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'pertanyaan' => 'required',
    //     ]);

    //     Questions::create([
    //         'kode' => $request->kode,
    //         'pertanyaan' => $request->pertanyaan,
    //         'type' => $request->type,
    //         'dimensi' => $request->dimensi,
    //         'key_answer' => $request->key_answer,
    //     ]);

    //     return response()->json([
    //         'message' => 'soal berhasil ditambahkan.',
    //         'error' => false,
    //     ]);
    // }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'pertanyaan' => 'required',
            'type' => 'required',
            'dimensi' => 'required',
            'key_answer' => 'required',
            'pdfFile' => 'nullable|file|mimes:pdf|max:10000',
        ]);
        // Check if the file is being uploaded
        if ($request->hasFile('pdfFile')) {
            $filePath = $request->file('pdfFile')->store('pertanyaan', 'public');
        } else {
            $filePath = null;
        }

        Questions::create([
            'kode' => $request->kode,
            'pertanyaan' => $request->pertanyaan,
            'type' => $request->type,
            'dimensi' => $request->dimensi,
            'key_answer' => $request->key_answer,
            'file_path' => $filePath,
        ]);
        return response()->json([
            'message' => 'Soal berhasil ditambahkan.',
            'error' => false,
        ]);
    }


    public function storeexcel(Request $request)
    {
        // Validasi bahwa permintaan harus berupa array
        $request->validate([
            '*.pertanyaan' => 'required',  // Validasi bahwa setiap pertanyaan dalam array harus ada
        ]);

        // Loop setiap item dalam array dan simpan ke database
        foreach ($request->all() as $soal) {
            switch ($soal['type']) {
                case 'Studi Kasus':
                    $soal['type'] = 'studi_kasus';
                    break;
                case 'Intray Analisis':
                    $soal['type'] = 'intray_analisis';
                    break;
                case 'Kuisioner Perilaku':
                    $soal['type'] = 'kuisioner_perilaku';
                    break;
            }
            $soal['dimensi'] = strtolower($soal['dimensi']);
            Questions::create([
                'kode' => $soal['kode'],
                'pertanyaan' => $soal['pertanyaan'],
                'type' => $soal['type'],
                'dimensi' => $soal['dimensi'],
                'key_answer' => $soal['key_answer'],
            ]);
        }

        return response()->json([
            'message' => 'Semua soal berhasil ditambahkan.',
            'error' => false,
        ]);
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'upload' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $file = $request->file('upload');
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('public/uploads', $fileName);

            $url = Storage::url($path);

            return response()->json([
                'url' => $url,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'pertanyaan' => 'required',
            'dimensi' => 'required',
            'pdfFile' => 'nullable|file|mimes:pdf|max:10000',
        ]);

        $question = Questions::find($request->id);

        if (!$question) {
            return response()->json([
                'message' => 'soal tidak ditemukan.',
                'error' => true,
            ]);
        }

        $question->update([
            'is_active' => 0,
            'updated_at' => now(),
        ]);

        if ($request->hasFile('pdfFile')) {
            $filePath = $request->file('pdfFile')->store('pertanyaan', 'public');
        } else {
            $filePath = null;
        }

        $res = Questions::create([
            'kode' => $request->kode,
            'pertanyaan' => $request->pertanyaan,
            'dimensi' => $request->dimensi,
            'type' => $request->type,
            'key_answer' => $request->key_answer,
            'is_active' => 1,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'Data berhasil diubah.',
            'error' => false,
        ]);
    }

    public function detail($kode)
    {
        $question = Questions::where('kode', $kode)->where('is_active', true)->first();
        return Inertia::render('Admin/Banksoal/DetailSoal', ['data' => $question]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $question = Questions::find($request->id);

        if (!$question) {
            return response()->json([
                'message' => 'Soal tidak ditemukan.',
                'error' => true,
            ]);
        } else {
            $question->update([
                'is_active' => 0,
                'updated_at' => now()
            ]);

            return response()->json([
                'message' => 'Soal berhasil dihapus.',
                'error' => false,
            ]);
        }
    }
}
