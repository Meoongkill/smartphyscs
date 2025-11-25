<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    public $fillable = [
        'session_id',
        'user_id',
        'category',
        'is_predicted',
        // Queue status tracking
        'prediction_status',
        'prediction_error',
        'prediction_queued_at',
        'prediction_completed_at',
        // Bot scores
        'score_bot_integritas',
        'score_bot_kerja_sama',
        'score_bot_komunikasi',
        'score_bot_orientasi_pada_hasil',
        'score_bot_pelayanan_publik',
        'score_bot_pengembangan_diri_dan_orang_lain',
        'score_bot_mengelola_perubahan',
        'score_bot_pengambilan_keputusan',
        'score_bot_perekat_bangsa',
        // Human scores
        'score_human_integritas',
        'score_human_kerja_sama',
        'score_human_komunikasi',
        'score_human_orientasi_pada_hasil',
        'score_human_pelayanan_publik',
        'score_human_pengembangan_diri_dan_orang_lain',
        'score_human_mengelola_perubahan',
        'score_human_pengambilan_keputusan',
        'score_human_perekat_bangsa',
        // Similarity scores
        'similarity_integritas',
        'similarity_kerja_sama',
        'similarity_komunikasi',
        'similarity_orientasi_pada_hasil',
        'similarity_pelayanan_publik',
        'similarity_pengembangan_diri_dan_orang_lain',
        'similarity_mengelola_perubahan',
        'similarity_pengambilan_keputusan',
        'similarity_perekat_bangsa',
    ];
    use HasFactory;

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function sessions()
    {
        return $this->belongsTo(Session::class, 'session_id', 'id');
    }

    public function answers()
    {
        return $this->hasMany(Answers::class, 'test_result_id', 'id');
    }
}
