<?php

namespace App\Http\Controllers;

use App\Models\Answers;
use App\Models\EnrolledTest;
use App\Services\PredictionService;
use App\Jobs\ProcessPredictionJob;
use App\Jobs\ProcessBatchPredictionJob;
use Inertia\Inertia;
use App\Models\User;
use App\Models\TestResult;
use App\Models\TestCollection;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\Questions;
use App\Models\SessionsPivotTestCollection;
use App\Models\TestCollectionPivotQuestion;
use Termwind\Components\Raw;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Redirect;

use function Termwind\render;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function joinTest(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        $kode = $request->input('kode');

        $testCollection = TestCollection::where('kode', $kode)
            ->with('questions')
            ->first();

        if ($testCollection) {
            //  dd($testCollection);
            //  return redirect('test-detail/' . $testCollection->kode);
            return redirect('test-detail', ['kode' => $kode]);
        } else {
            $errorMessage = 'Kode tes tidak valid.';
            return redirect()
                ->back()
                ->with('error', $errorMessage);
        }
    }

    public function test($kode)
    {
        $testCollection = TestCollection::where('kode', $kode)->with('questions')->first();
        // dd($testCollection);
        return Inertia::render('Test', [
            'testCollection' => $testCollection,
        ]);
    }

    public function testVerification(Request $request)
    {
        // $testCollection = new TestCollection;
        $kode = $request->input('kode');
        $testId = TestCollection::where('kode', $kode)->exists();

        if ($testId === null) {
            $errorMessage = 'Kode tes tidak valid.';
            return redirect()
                ->back()
                ->with('error', $errorMessage);
            // $testCollection = TestCollection::where('kode', $kode)->with('questions')->get();
            // return redirect('test-detail/' . $kode);
            // return Inertia::render('Test', [
            //     'testCollection' => $testCollection,
            // ]);
        }
        return redirect('test-detail/' . $kode);
    }

    public function verifyTest(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        $kode = $request->input('kode');

        $testCollection = TestCollection::where('kode', $kode)
            ->with('questions')
            ->first();

        $check_redudant = EnrolledTest::where('user_id', Auth::id())->where('test_collection_id', $testCollection->id)->get();
        if ($check_redudant->count() > 0) {
            return redirect()->back()->with('error', 'Anda sudah terdaftar pada tes ini.');
        }
        EnrolledTest::create([
            'user_id' => Auth::id(),
            'test_collection_id' => $testCollection->id,
        ]);

        return redirect()->back();
    }

    public function testLandingPage($kode = null)
    {
        return Inertia::render('User/Test', ['kode' => $kode]);
    }

    public function testDetail($kode)
    {
        $testCollection = TestCollection::where('kode', $kode)
            ->with('questions')
            ->get();
        return Inertia::render('User/DetailTest', ['testCollection' => $testCollection]);
    }

    public function showDetail($kode)
    {
        $testCollection = TestCollection::where('kode', $kode)
            ->with('questions')
            ->firstOrFail();

        return inertia('TestDetail', [
            'testCollection' => $testCollection,
        ]);
    }

    public function startTest($kode)
    {
        $testCollection = TestCollection::where('kode', $kode)
            ->with('questions')
            ->firstOrFail();
        $get_id = $testCollection->id;
        $youAlreadyTestBefore = false;
        $check_test = TestResult::where('user_id', Auth::id())->where('test_id', $get_id)->get();
        if ($check_test->count() > 0) {
            $youAlreadyTestBefore = true;
        } else {
            $youAlreadyTestBefore = false;
        }
        return Inertia::render('User/Test', ['testCollection' => $testCollection, 'youAlreadyTestBefore' => $youAlreadyTestBefore]);
    }

    public function dashboard()
    {
        // dd( Auth::user()->roles->pluck('name')[0] );
        switch (Auth::user()->roles->pluck('name')[0]) {
            case 'admin':
                return redirect('/admin-dashboard');
            case 'psikolog':
                return redirect('/psikolog-dashboard');
            case 'user':
                // $tests = EnrolledTest::where('user_id', Auth::id())
                //     ->with('session')
                //     ->get();
                // dd($tests);

                // $testCollections = $tests->map(function ($test) {
                //     return $test->testCollection;
                // });

                $testCollections = [
                    [
                        'id' => 1,
                        'nama' => 'Test 1',
                        'deskripsi' => 'Deskripsi Test 1',
                        'kode' => 'test1',
                        'is_active' => 1,
                        'created_at' => '2021-08-01 00:00:00',
                        'updated_at' => '2021-08-01 00:00:00',
                    ]
                ];

                return Inertia::render('User/Dashboard', [
                    'tests' => $testCollections,
                ]);
        }
    }


    public function detailTest($id)
    {
        $test = TestCollection::findOrFail($id);
        // $auth = Auth::user();
        // dd($auth);

        return Inertia::render('User/TestDetail', [
            'testCollection' => $test,
            // 'auth' => $auth,
        ]);
    }

    public function adminDashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function psikologDashboard()
    {
        return Inertia::render('Psikolog/Dashboard');
    }

    public function addUser()
    {
        // Mengecek nomor terakhir yang digunakan dari session
        $nomorTerakhir = Session::get('nomor_psikolog', 1);

        // Membuat alamat email berdasarkan nomor terakhir
        $email = "psikologi{$nomorTerakhir}@gmail.com";
        $nama = "psikologi{$nomorTerakhir}";

        // Menambahkan user ke database
        $user = User::create([
            'name' => $nama,
            'email' => $email,
            'nik' => "nik",
            'nohp' => "nohp",
            'alamat' => "alamat",
            'foto' => "-",
            'password' => Hash::make('psikolog123'),
        ]);

        // Memberikan role 'psikolog' kepada user
        $user->assignRole('psikolog');

        // Menambahkan 1 ke nomor terakhir untuk penggunaan selanjutnya
        $nomorTerakhir++;
        Session::put('nomor_psikolog', $nomorTerakhir);

        return redirect()
            ->back()
            ->with('success', 'User berhasil ditambahkan');
    }

    public function show($type, $id)
    {
        $collection = TestCollection::find($id);
        $questions = Questions::where('test_id', $id)->get();
        // dd($questions);
        $path = "Admin/Detail_$type";
        return Inertia::render($path, [
            'collection' => $collection,
            'questions' => $questions,
        ]);
    }
    public function resultTest(Request $request, $kode)
    {
        $formattedData = [];
        foreach ($request->data as $item) {
            $formattedData[] = [
                'id' => $item['key'],
                'dimensi' => Questions::select('dimensi')->where('id', $item['key'])->first()->dimensi,
                'jawaban' => $item['value'],
            ];
        }
        $batch = ['batch' => $formattedData];
        $client = new Client();
        try {
            $testCollection = TestCollection::where('kode', $kode)->first();
            $idTest = $testCollection->id;
            // dd($idTest);

            $mainData = $request['data'];
            $datauser = $request['user'];
            $idUser = intval($datauser['id']);

            $dataFix = array_map(function ($main) {
                return [
                    "key" => $main["key"],
                    "value" => $main["value"],
                ];
            }, $mainData);

            TestResult::create([
                'test_id' => $idTest,
                'user_id' => $idUser,
            ]);
            $tr = TestResult::latest()->where('user_id', $idUser)->first();
            foreach ($dataFix as $item) {
                Answers::create([
                    'jawaban' => $item['value'],
                    'skor' => 0,
                    'question_id' => $item['key'],
                    'result_id' => $tr["id"],
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function BreakPages($kode)
    {
        // get user data
        $user = User::find(Auth::id());

        // get session data
        $session = Session::where('code', $kode)->first();

        // get test collection data
        $test_collections = SessionsPivotTestCollection::where('session_id', $session->id)
            ->with('testCollection')
            ->get();

        // get the lastest test result with the same session id
        $testResult = TestResult::where('session_id', $session->id)
            ->where('user_id', Auth::id())
            ->latest()
            ->first();

        $duration = null;
        $total_questions = null;
        $break = null;
        $status = null;
        $questions = null;

        if (!$testResult) {
            $status = 'studi_kasus';
            $break = true;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'studi_kasus');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'studi_kasus');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'studi_kasus');
                }])
                ->get();

            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
            $duration = $session->duration_1;
        } else if ($testResult->category == 'studi_kasus_istirahat') {
            $status = 'studi_kasus';
            $break = false;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'studi_kasus');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'studi_kasus');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'studi_kasus');
                }])
                ->get();

            // Ambil total jumlah questions dari data yang sudah diambil
            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            // ambil data duration
            $duration = $session->duration_1;
            // Ambil data questions
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
        } else if ($testResult->category == 'studi_kasus') {
            $status = 'intray_analisis';
            $break = true;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'intray_analisis');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'intray_analisis');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'intray_analisis');
                }])
                ->get();

            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
            $duration = $session->duration_2;
        } else if ($testResult->category == 'intray_analisis_istirahat') {
            $status = 'intray_analisis';
            $break = false;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'intray_analisis');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'intray_analisis');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'intray_analisis');
                }])
                ->get();

            // Ambil total jumlah questions dari data yang sudah diambil
            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            $duration = $session->duration_2;
            // Ambil data questions
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
        } else if ($testResult->category == 'intray_analisis') {
            $status = 'kuisioner_perilaku';
            $break = true;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                }])
                ->get();

            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
            $duration = $session->duration_3;
        } else if ($testResult->category == 'kuisioner_perilaku_istirahat') {
            $status = 'kuisioner_perilaku';
            $break = false;
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                }])
                ->withCount(['question' => function ($query) {
                    $query->where('type', 'kuisioner_perilaku');
                }])
                ->get();
            // Ambil total jumlah questions dari data yang sudah diambil
            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            $duration = $session->duration_3;

            // Ambil data questions
            $questions = $testCollectionPivotQuestions->pluck('question')->flatten();
        } else if ($testResult->category == 'kuisioner_perilaku') {
            $status = 'selesai';
            $break = true;

            // redirect to result page
        }

        if ($break) {
            $data = [
                'user' => $user,
                'session' => $session,
                'status' => $status,
                'break' => $break,
                'duration' => $duration,
                'total_questions' => $total_questions,
                'questions' => $questions ?? [],
            ];

            return Inertia::render("User/BreakPage", [
                'data' => $data,
            ]);
        } else {
            // redirect to test page
            $data = [
                'user' => $user,
                'session' => $session,
                'status' => $status,
                'break' => $break,
                'duration' => $duration,
                'total_questions' => $total_questions,
                'questions' => $questions,
            ];
            return Inertia::render("User/TestPage", [
                'data' => $data,
            ]);
        }
    }

    public function BreakPage($kode)
    {
        // get user data
        $user = User::find(Auth::id());

        // get session data
        $session = Session::where('code', $kode)->first();

        // Mengambil test collections beserta questions
        $test_collections = SessionsPivotTestCollection::where('session_id', $session->id)
            ->with('testCollection')
            ->get();

        // get the lastest test result with the same session id
        $testResult = TestResult::where('session_id', $session->id)
            ->where('user_id', Auth::id())
            ->latest()
            ->first();

        $duration = null;
        $total_questions = null;
        $break = null;
        $status = null;
        $questions = null;

        // Helper function to get questions for a specific type
        $getQuestionsForType = function ($type, $durationField) use ($session) {
            $testCollectionPivotQuestions = TestCollectionPivotQuestion::where('is_active', true)
                ->whereHas('question', function ($query) use ($type) {
                    $query->where('type', $type);
                })
                ->whereHas('testCollection', function ($query) use ($session) {
                    $query->whereIn('id', SessionsPivotTestCollection::where('session_id', $session->id)->pluck('test_collection_id'));
                })
                ->with(['question' => function ($query) use ($type) {
                    $query->where('type', $type);
                }])
                ->withCount(['question' => function ($query) use ($type) {
                    $query->where('type', $type);
                }])
                ->get();

            // Ambil total jumlah questions dari data yang sudah diambil
            $total_questions = $testCollectionPivotQuestions->sum('question_count');
            // Ambil data questions
            $questions = $testCollectionPivotQuestions->pluck('question')->filter()->values();

            // DEBUG: Log questions data
            Log::info('Questions Data', [
                'type' => $type,
                'pivot_count' => $testCollectionPivotQuestions->count(),
                'questions_count' => $questions->count(),
                'first_question' => $questions->first() ? $questions->first()->toArray() : null
            ]);

            // Ambil data duration
            $duration = $session->$durationField;

            return [$total_questions, $questions, $duration];
        };

        if (!$testResult) {
            $status = 'studi_kasus';
            $break = true;
            list($total_questions, $questions, $duration) = $getQuestionsForType('studi_kasus', 'duration_1');
        } else if ($testResult->category == 'studi_kasus_istirahat') {
            $status = 'studi_kasus';
            $break = false;
            list($total_questions, $questions, $duration) = $getQuestionsForType('studi_kasus', 'duration_1');
        } else if ($testResult->category == 'studi_kasus') {
            $status = 'intray_analisis';
            $break = true;
            list($total_questions, $questions, $duration) = $getQuestionsForType('intray_analisis', 'duration_2');
        } else if ($testResult->category == 'intray_analisis_istirahat') {
            $status = 'intray_analisis';
            $break = false;
            list($total_questions, $questions, $duration) = $getQuestionsForType('intray_analisis', 'duration_2');
        } else if ($testResult->category == 'intray_analisis') {
            $status = 'kuisioner_perilaku';
            $break = true;
            list($total_questions, $questions, $duration) = $getQuestionsForType('kuisioner_perilaku', 'duration_3');
        } else if ($testResult->category == 'kuisioner_perilaku_istirahat') {
            $status = 'kuisioner_perilaku';
            $break = false;
            list($total_questions, $questions, $duration) = $getQuestionsForType('kuisioner_perilaku', 'duration_3');
        } else if ($testResult->category == 'kuisioner_perilaku') {
            $status = 'selesai';
            $break = true;
            // Redirect to result page
        }

        // // handle jika salah satu kategori tidak tersedia pertanyaannya
        // if ($total_questions == 0) {
        //     $status = 'selesai';
        //     $break = true;
        //     return Inertia::location('/dashboard');
        // }

        // Convert questions to array properly
        $questionsArray = [];
        if ($questions) {
            foreach ($questions as $q) {
                if ($q) {
                    $questionsArray[] = $q->toArray();
                }
            }
        }

        Log::info('Final Data to Frontend', [
            'status' => $status,
            'break' => $break,
            'total_questions' => $total_questions,
            'questions_array_count' => count($questionsArray),
            'first_question_id' => isset($questionsArray[0]['id']) ? $questionsArray[0]['id'] : null
        ]);

        $data = [
            'user' => $user,
            'session' => $session,
            'status' => $status,
            'break' => $break,
            'duration' => $duration,
            'total_questions' => $total_questions,
            'questions' => $questionsArray,
            'test_collections' => $test_collections,
            'page_key' => $break ? 'break' : 'test',
        ];

        if ($break) {
            return Inertia::render("User/BreakPage", [
                'data' => $data,
            ]);
        } else {
            return Inertia::render("User/TestPage", [
                'data' => $data,
            ]);
        }
    }



    // public function TestPage()
    // {
    //     return Inertia::render("User/TestPage");
    // }

    public function ResultPage()
    {
        return Inertia::render("User/ResultPage");
    }

    public function validateSession(Request $request, $kode)
    {
        // Ambil kode dari query string
        // $code = $request->query('code');

        // Cari session berdasarkan kode
        $session = Session::where('code', $kode)->first();
        if (!$session) {
            return response()->json([
                'message' => 'Sesi tidak valid.',
                'error' => true,
            ]);
        }

        // check if session is on period
        date_default_timezone_set('Asia/Jakarta');
        $now = date('Y-m-d H:i:s');
        if ($now < $session->start_date || $now > $session->end_date) {

            return response()->json([
                'message' => 'Sesi tidak sedang berlangsung.',
                'error' => true,
            ]);
        }

        // Cek apakah user sudah mengerjakan tes ini
        $result = TestResult::where('session_id', $session->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($result) {
            return response()->json([
                'message' => 'Anda sudah mengerjakan tes dengan sesi ini.',
                'error' => true,
            ]);
        }

        // Cek apakah user terdaftar dalam sesi
        $enrolled = EnrolledTest::where('session_id', $session->id)
            ->where('user_id', Auth::id())
            ->first();
        // return response()->json($data);


        if ($enrolled) {
            // dd($enrolled);
            // Data yang ingin dikirim ke Dashboard

            $data = [
                'session_code' => $kode,
                'duration_1' => $session->duration_1,
                'duration_2' => $session->duration_2,
                'duration_3' => $session->duration_3,
                'is_valid' => true,
            ];

            // Redirect kembali ke halaman sebelumnya (biasanya Dashboard) dengan data yang dikirim
            return response()->json([
                'message' => 'Anda terdaftar dalam sesi ini.',
                'data' => $data,
                'error' => false,
            ]);
        }

        return response()->json([
            'message' => 'Anda tidak terdaftar dalam sesi ini.',
            'error' => true,
        ]);
    }

    public function storeResult(Request $request)
    {
        // dd($request->all());
        // Validasi input
        $validated = $request->validate([
            'code' => 'required|string|exists:sessions,code',
            'answers.*.question_id' => 'integer|exists:questions,id',
            'answers.*.answer' => 'string',
        ]);

        // Dapatkan kode dari input request
        $code = $request->input('code');

        // Dapatkan data sesi berdasarkan kode
        $session = Session::where('code', $code)->firstOrFail();

        // Periksa tabel hasil tes
        $testResult = TestResult::where('session_id', $session->id)
            ->where('user_id', Auth::id())
            ->latest()
            ->first();

        $newCategory = null;
        if (!$testResult) {
            $newCategory = 'studi_kasus_istirahat';
        } else if ($testResult->category == 'studi_kasus_istirahat') {
            $newCategory = 'studi_kasus';
        } else if ($testResult->category == 'studi_kasus') {
            $newCategory = 'intray_analisis_istirahat';
        } else if ($testResult->category == 'intray_analisis_istirahat') {
            $newCategory = 'intray_analisis';
        } else if ($testResult->category == 'intray_analisis') {
            $newCategory = 'kuisioner_perilaku_istirahat';
        } else if ($testResult->category == 'kuisioner_perilaku_istirahat') {
            $newCategory = 'kuisioner_perilaku';
        }

        // Buat hasil tes baru jika kategori baru ditentukan
        if ($newCategory) {
            $testResult = TestResult::create([
                'session_id' => $session->id,
                'user_id' => Auth::id(),
                'is_predicted' => false,
                'category' => $newCategory,
            ]);
        }

        // Simpan jawaban
        if ($testResult && $request->has('answers')) {
            $this->storeAnswers($request->input('answers'), $testResult);
        }

        // Jika sudah selesai semua tes (category = kuisioner_perilaku), panggil prediction API
        if ($newCategory === 'kuisioner_perilaku') {
            $this->processPrediction($testResult);
        }

        return response()->json(['message' => 'Test result and answers saved successfully.']);
    }

    /**
     * Process prediction for completed test using Queue
     * Job akan diproses secara batch (3 user per batch)
     */
    private function processPrediction($testResult)
    {
        try {
            // Update status dan timestamp
            $testResult->update([
                'prediction_status' => 'pending',
                'prediction_queued_at' => now()
            ]);

            Log::info('Test result queued for prediction', [
                'user_id' => $testResult->user_id,
                'test_result_id' => $testResult->id,
                'status' => 'pending'
            ]);

            // Trigger batch processing job
            // Job ini akan mengecek pending predictions dan process max 3 sekaligus
            ProcessBatchPredictionJob::dispatch()
                ->delay(now()->addSeconds(2)) // Delay 2 detik sebelum mulai
                ->onQueue('batch-predictions');
        } catch (\Exception $e) {
            Log::error('Queue Dispatch Error', [
                'test_result_id' => $testResult->id,
                'message' => $e->getMessage()
            ]);

            // Fallback: update status sebagai failed
            $testResult->update([
                'prediction_status' => 'failed',
                'prediction_error' => $e->getMessage()
            ]);
        }
    }

    // Fungsi private untuk menyimpan jawaban
    private function storeAnswers($data, $testResult)
    {
        foreach ($data as $item) {
            Answers::create([
                'user_id' => Auth::id(),
                'question_id' => $item['question_id'],
                'test_result_id' => $testResult->id,
                'jawaban' => $item['answer'],
                'score_bot' => null,
                'score_psikolog' => null,
            ]);
        }
    }
}
