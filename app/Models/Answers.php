<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Answers extends Model
{
    public $fillable = [
        'user_id',
        'question_id',
        'test_result_id',
        'jawaban',
        'skor_bot',
        'skor_psikolog',
    ];

    public function question()
    {
        return $this->belongsTo(Questions::class);
    }

    public function testResult()
    {
        return $this->belongsTo(TestResult::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    use HasFactory;

}
