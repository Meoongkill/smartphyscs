<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('test_results', function (Blueprint $table) {
            $table->string('prediction_status')->nullable()->after('is_predicted')
                ->comment('pending, processing, completed, failed');
            $table->text('prediction_error')->nullable()->after('prediction_status')
                ->comment('Error message if prediction failed');
            $table->timestamp('prediction_queued_at')->nullable()->after('prediction_error')
                ->comment('When prediction job was queued');
            $table->timestamp('prediction_completed_at')->nullable()->after('prediction_queued_at')
                ->comment('When prediction was completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_results', function (Blueprint $table) {
            $table->dropColumn(['prediction_status', 'prediction_error', 'prediction_queued_at', 'prediction_completed_at']);
        });
    }
};
