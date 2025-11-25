<?php

namespace App\Jobs;

use App\Models\TestResult;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessBatchPredictionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $batchSize = 3; // Process 3 users per batch
    public $delayBetweenBatches = 5; // Delay 5 detik antar batch
    public $timeout = 300; // 5 menit timeout

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     * 
     * Job ini akan dijalankan secara scheduled (contoh: setiap 1 menit)
     * untuk mengecek apakah ada test results yang perlu di-predict
     */
    public function handle(): void
    {
        Log::info('Queue: Starting batch prediction job');

        // Ambil test results yang belum di-predict (is_predicted = false)
        // Limit sesuai batch size
        $pendingResults = TestResult::where('is_predicted', false)
            ->whereNull('prediction_status')
            ->orderBy('created_at', 'asc')
            ->limit($this->batchSize)
            ->get();

        if ($pendingResults->isEmpty()) {
            Log::info('Queue: No pending predictions found');
            return;
        }

        Log::info('Queue: Processing batch', [
            'batch_size' => $pendingResults->count(),
            'test_result_ids' => $pendingResults->pluck('id')->toArray()
        ]);

        // Mark sebagai processing
        foreach ($pendingResults as $testResult) {
            $testResult->update(['prediction_status' => 'processing']);
        }

        // Dispatch individual jobs untuk setiap test result
        foreach ($pendingResults as $index => $testResult) {
            // Delay setiap job agar tidak overload server ML
            $delaySeconds = $index * 2; // 2 detik delay antar job dalam batch

            ProcessPredictionJob::dispatch($testResult->id)
                ->delay(now()->addSeconds($delaySeconds))
                ->onQueue('predictions'); // Queue khusus untuk predictions
        }

        Log::info('Queue: Batch dispatched successfully', [
            'total_jobs' => $pendingResults->count()
        ]);

        // Schedule next batch dengan delay
        if (TestResult::where('is_predicted', false)->whereNull('prediction_status')->exists()) {
            // Masih ada pending, dispatch batch berikutnya
            ProcessBatchPredictionJob::dispatch()
                ->delay(now()->addSeconds($this->delayBetweenBatches))
                ->onQueue('batch-predictions');
        }
    }
}
