<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    public $fillable = [
        'name',
        'description',
        'duration_1',
        'duration_2',
        'duration_3',
        'start_date',
        'end_date',
        'code',
        'status',
        'is_active',
    ];

    // get relation with SessionsPivotTestCollection
    public function testCollections()
    {
        return $this->hasMany(SessionsPivotTestCollection::class);
    }

    // get relation with TestResult
    public function testResults()
    {
        return $this->hasMany(TestResult::class, 'session_id');
    }

    // Relationship untuk psikolog yang bisa akses session ini
    public function assignedPsikolog()
    {
        return $this->belongsToMany(User::class, 'psikolog_session', 'session_id', 'user_id')
            ->withTimestamps();
    }

    use HasFactory;
}
