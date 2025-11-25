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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->default('SOAL-'.date('YmdHis').'-'.rand(1000, 9999));
            $table->text('pertanyaan');
            $table->text('type');
            $table->string('dimensi')->nullable()->default(null);
            $table->string('key_answer')->nullable()->default(null);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
