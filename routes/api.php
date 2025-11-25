<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PredictionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Prediction API Routes
Route::post('/predict', [PredictionController::class, 'predictSingle']);
Route::post('/predict/batch', [PredictionController::class, 'predictBatch']);
Route::post('/predict/test-result/{testResultId}', [PredictionController::class, 'predictTestResult']);
Route::get('/predict/dummy', [PredictionController::class, 'getDummy']);
