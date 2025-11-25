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
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('sessions');
            $table->foreignId('user_id')->constrained('users');
            $table->boolean('is_predicted')->default(false);
            $table->string('category')->nullable()->default(null);

            // Score Bot (AI Predictions) per dimension
            $table->integer('score_bot_integritas')->nullable();
            $table->integer('score_bot_kerja_sama')->nullable();
            $table->integer('score_bot_komunikasi')->nullable();
            $table->integer('score_bot_orientasi_pada_hasil')->nullable();
            $table->integer('score_bot_pelayanan_publik')->nullable();
            $table->integer('score_bot_pengembangan_diri_dan_orang_lain')->nullable();
            $table->integer('score_bot_mengelola_perubahan')->nullable();
            $table->integer('score_bot_pengambilan_keputusan')->nullable();
            $table->integer('score_bot_perekat_bangsa')->nullable();

            // Score Human (Psikolog Assessment) per dimension
            $table->integer('score_human_integritas')->nullable();
            $table->integer('score_human_kerja_sama')->nullable();
            $table->integer('score_human_komunikasi')->nullable();
            $table->integer('score_human_orientasi_pada_hasil')->nullable();
            $table->integer('score_human_pelayanan_publik')->nullable();
            $table->integer('score_human_pengembangan_diri_dan_orang_lain')->nullable();
            $table->integer('score_human_mengelola_perubahan')->nullable();
            $table->integer('score_human_pengambilan_keputusan')->nullable();
            $table->integer('score_human_perekat_bangsa')->nullable();

            // Similarity Scores (AI Confidence) per dimension
            $table->float('similarity_integritas')->nullable();
            $table->float('similarity_kerja_sama')->nullable();
            $table->float('similarity_komunikasi')->nullable();
            $table->float('similarity_orientasi_pada_hasil')->nullable();
            $table->float('similarity_pelayanan_publik')->nullable();
            $table->float('similarity_pengembangan_diri_dan_orang_lain')->nullable();
            $table->float('similarity_mengelola_perubahan')->nullable();
            $table->float('similarity_pengambilan_keputusan')->nullable();
            $table->float('similarity_perekat_bangsa')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
