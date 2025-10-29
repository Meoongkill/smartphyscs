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
        'score_bot',
        'score_human',
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
