<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestCollectionPivotQuestion extends Model
{
    protected $table = 'test_collection_pivot_question';
    public $fillable = [
        'question_id',
        'test_collection_id',
        'type',
        'is_active'
    ];

    public function question()
    {
        return $this->belongsTo(Questions::class);
    }

    public function testCollection()
    {
        return $this->belongsTo(TestCollection::class);
    }

    use HasFactory;
}
