<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Questions;
use App\Models\TestResults;
use App\Models\Answers;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestCollection extends Model
{
    public $fillable = [
        'nama',
        'deskripsi',
        'kode',
        'is_active',
    ];

    public function pivotQuestions()
    {
        return $this->hasMany(TestCollectionPivotQuestion::class, 'test_collection_id');
    }


    use HasFactory;
}
