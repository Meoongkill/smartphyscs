<?php

namespace App\Jobs;

use App\Models\TestResult;
use App\Models\Answers;
use App\Services\PredictionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessPredictionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $testResultId;
    public $timeout = 120; // 2 menit timeout per job
    public $tries = 3; // Retry 3 kali jika gagal

    /**
     * Create a new job instance.
     */
    public function __construct($testResultId)
    {
        $this->testResultId = $testResultId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $testResult = TestResult::find($this->testResultId);

            if (!$testResult) {
                Log::warning('TestResult not found in queue', ['id' => $this->testResultId]);
                return;
            }

            Log::info('Queue: Processing prediction', [
                'test_result_id' => $this->testResultId,
                'user_id' => $testResult->user_id,
                'attempt' => $this->attempts()
            ]);

            $predictionService = new PredictionService();

            // Get all answers for this user and session
            $allAnswers = Answers::whereHas('testResult', function ($query) use ($testResult) {
                $query->where('user_id', $testResult->user_id)
                    ->where('session_id', $testResult->session_id);
            })->get();

            if ($allAnswers->isEmpty()) {
                Log::warning('No answers found for prediction', [
                    'test_result_id' => $this->testResultId
                ]);
                return;
            }

            // Process prediction (masih pakai dummy = true, nanti ganti false kalau server ML ready)
            $predictionService->processAllAnswers($testResult, $allAnswers, false);

            Log::info('Queue: Prediction completed successfully', [
                'test_result_id' => $this->testResultId,
                'user_id' => $testResult->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Queue: Prediction failed', [
                'test_result_id' => $this->testResultId,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw exception supaya job retry (sampai max tries)
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Queue: Prediction job failed permanently', [
            'test_result_id' => $this->testResultId,
            'error' => $exception->getMessage()
        ]);

        // Optional: Update test result dengan status failed
        $testResult = TestResult::find($this->testResultId);
        if ($testResult) {
            $testResult->update([
                'prediction_status' => 'failed',
                'prediction_error' => $exception->getMessage()
            ]);
        }
    }
}
