<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PsikologController;
use App\Http\Controllers\Psikolog2Controller;
use App\Http\Controllers\PsikologManagementController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TestCollectionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserManagementController;
use App\Models\Session;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/dashboard');
});

// Routes for all authenticated users (psikolog, admin, user)
Route::middleware('auth', 'verified', 'role:psikolog|admin|user')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/admin/user', [AdminController::class, 'users'])->middleware(['role:admin'])->name('admin.users');
});

// Admin Only Routes
Route::middleware('auth', 'verified', 'role:admin')->group(function () {
    // Dashboard
    Route::get('/admin-dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/detail-test/{kode}', [AdminController::class, 'detailTest'])->name('admin.detail');
    Route::get('/detail-test/{id}/hasil', [AdminController::class, 'hasilTest'])->name('admin.hasilTest');

    // Bank Soal (Question Bank)
    Route::get('/bank-soal', [QuestionsController::class, 'index'])->name('admin.bankSoal');
    Route::get('/bank-soal/create', [QuestionsController::class, 'create'])->name('admin.create');
    Route::get('/bank-soal/edit/{kode}', [QuestionsController::class, 'edit'])->name('admin.edit');
    Route::post('/add-soal', [QuestionsController::class, 'store'])->name('admin.createSoal');
    Route::post('/add-soall', [QuestionsController::class, 'storeexcel'])->name('admin.createSoalexcel');
    Route::patch('/bank-soal/delete', [QuestionsController::class, 'destroy'])->name('soal.delete');
    Route::post('/bank-soal/update', [QuestionsController::class, 'update'])->name('admin.updateSoal');
    Route::get('/bank-soal/{kode}', [QuestionsController::class, 'detail'])->name('admin.detailSoal');

    // Test Collection
    Route::get('/test-collection/detail/{id}', [TestCollectionController::class, 'Detail'])->name('admin.CollectionSoalDetail');
    Route::get('/test-collection', [TestCollectionController::class, 'index'])->name('admin.testCollection');
    Route::post('/test-collection', [TestCollectionController::class, 'store'])->name('admin.createCollection');
    Route::patch('/test-collection/delete', [TestCollectionController::class, 'destroy'])->name('collection.delete');
    Route::patch('/test-collection/update', [TestCollectionController::class, 'update'])->name('admin.updateCollection');
    Route::post('/test-collection/add-question', [TestCollectionController::class, 'storeQuestion'])->name('admin.addQuestion');
    Route::patch('/test-collection/delete-question', [TestCollectionController::class, 'deleteQuestion'])->name('question.delete');
    Route::get('/test-collection/{kode}', [TestCollectionController::class, 'showQuestionCollection'])->name('admin.showCollection');
    Route::get('/test-collection/{kode}/add-soal', [TestCollectionController::class, 'create'])->name('admin.createPageCollection');

    // Session Management
    Route::get('/session', [SessionController::class, 'index'])->name('admin.session');
    Route::post('/add-session', [SessionController::class, 'store'])->name('admin.createSession');

    // Session Participants Management (harus di atas route {kode} untuk menghindari konflik)
    Route::get('/session/{id}/participants', [SessionController::class, 'sessionParticipant'])->name('admin.session.participants');
    Route::get('/session/{id}/participants/create', [SessionController::class, 'createSessionParticipant'])->name('admin.session.participants.create');
    Route::post('/session/{id}/participants/add', [SessionController::class, 'storeSessionParticipant'])->name('admin.session.participants.add');
    Route::delete('/session/{id}/participants/delete', [SessionController::class, 'deleteSessionParticipant'])->name('admin.session.participants.delete');

    Route::get('/session/{kode}', [SessionController::class, 'detail'])->name('admin.detailSession');
    Route::get('/session/{code}/detail/{user_id}', [SessionController::class, 'detail_jawaban'])->name('admin.detail.Jawaban');
    Route::patch('/session/delete', [SessionController::class, 'destroy'])->name('session.delete');
    Route::patch('/session/update', [SessionController::class, 'update'])->name('admin.updateSession');

    // Psikolog Management
    Route::get('/admin/psikolog', [PsikologManagementController::class, 'index'])->name('admin.psikologManagement');
    Route::post('/admin/psikolog/add', [PsikologManagementController::class, 'store'])->name('admin.psikolog.add');
    Route::patch('/admin/psikolog/update', [PsikologManagementController::class, 'update'])->name('admin.psikolog.update');
    Route::delete('/admin/psikolog/delete', [PsikologManagementController::class, 'destroy'])->name('admin.psikolog.delete');

    // User Management
    Route::get('/admin/users', [UserManagementController::class, 'index'])->name('admin.userManagement');
    Route::post('/admin/users/add', [UserManagementController::class, 'store'])->name('admin.users.add');
    Route::patch('/admin/users/update', [UserManagementController::class, 'update'])->name('admin.users.update');

    // AI Models Management
    Route::get('/admin/models', [AdminController::class, 'models'])->name('admin.models');
    Route::post('/admin/train-models', [AdminController::class, 'TrainModels'])->name('admin.trainModels');

    // Admin Test Result Details
    Route::get('/admin/detail_test/{id}/{test_id}', [AdminController::class, 'resultDetail'])->name('psikolog.detail');

    // Test Prediction
    Route::post('/predict-jawaban', [AdminController::class, 'predictTest'])->name('admin.predict');
});

// Psikolog and Admin Routes
Route::middleware('auth', 'verified', 'role:psikolog|admin')->group(function () {
    Route::get('/psikolog-dashboard', [PsikologController::class, 'index'])->name('psikolog.dashboard');
    Route::get('/psikolog-dashboard/{id}', [PsikologController::class, 'show'])->name('psikolog.show');
    Route::get('/psikolog/result-detail/{id}/{session_id}', [PsikologController::class, 'resultDetail'])->name('psikolog.result.detail');
    Route::get('/psikolog/result/{id}/{session_id}', [PsikologController::class, 'result'])->name('psikolog.result');
    Route::post('/psikolog/score', [PsikologController::class, 'storeScore'])->name('psikolog.score');
    Route::post('/image-upload', [QuestionsController::class, 'uploadImage'])->name('admin.uploadImage');

    // Psikolog2 Routes - New UI/UX Flow
    Route::get('/psikolog2', [Psikolog2Controller::class, 'index'])->name('psikolog2.dashboard');
    Route::get('/psikolog2/peserta/{sessionId}', [Psikolog2Controller::class, 'peserta'])->name('psikolog2.peserta');
    Route::get('/psikolog2/jawaban/{sessionId}/{userId}', [Psikolog2Controller::class, 'jawaban'])->name('psikolog2.jawaban');
    Route::post('/psikolog2/save-scores', [Psikolog2Controller::class, 'saveScores'])->name('psikolog2.saveScores');
    Route::get('/psikolog2/report/{sessionId}/{userId}', [Psikolog2Controller::class, 'report'])->name('psikolog2.report');
    // Report index for a session (no specific user) - shows aggregated report
    Route::get('/psikolog2/report/{sessionId}', [Psikolog2Controller::class, 'reportIndex'])->name('psikolog2.reportIndex');
    Route::get('/psikolog2/report-personal/{sessionId}/{userId}', [Psikolog2Controller::class, 'reportPersonal'])->name('psikolog2.reportPersonal');
    Route::get('/psikolog2/hasil-akhir/{sessionId}/{userId}', [Psikolog2Controller::class, 'hasilAkhir'])->name('psikolog2.hasilAkhir');


    // Di dalam group Route::middleware('auth', 'verified', 'role:psikolog|admin')
    Route::get('/psikolog2/report/{sessionId}', [Psikolog2Controller::class, 'reportIndex'])->name('psikolog2.reportIndex');
    Route::get('/psikolog2/report-personal/{sessionId}/{userId}', [Psikolog2Controller::class, 'reportPersonal'])->name('psikolog2.reportPersonal');
});

// User Only Routes (authenticated users)
Route::middleware('auth', 'verified', 'role:user')->group(function () {
    Route::get('/user-dashboard', [UserController::class, 'dashboard'])->name('user.dashboard');
    Route::get('/detail-test-user/{id}', [UserController::class, 'detailTest'])->name('user.detail');
    // Test Participation
    Route::post('/store-ujian', [UserController::class, 'joinTest']);
    // Route::get('/ujian/{kode}', [UserController::class, 'test'])->name('ujian.test');
    Route::post('/verify-test', [UserController::class, 'verifyTest']);
    Route::get('/validate-test/{kode}', [UserController::class, 'validateSession'])->name('validate-test');

    // Test Execution
    // Route::get('/test/{kode}', [UserController::class, 'startTest']);
    Route::get('/test-detail/{kode}', [UserController::class, 'showDetail'])->name('test-detail');
    Route::post('/test-result/{kode}', [UserController::class, 'resultTest'])->name('test-result');

    // Test Pages
    Route::get('/istirahat/{kode}', [UserController::class, 'BreakPage'])->name('break-page');
    // Route::get('/test-page', [UserController::class, 'TestPage'])->name('test-page');
    Route::get('/result-page', [UserController::class, 'ResultPage'])->name('result-page');
    Route::post('/result', [UserController::class, 'storeResult'])->name('store-result');
});

require __DIR__ . '/auth.php';
