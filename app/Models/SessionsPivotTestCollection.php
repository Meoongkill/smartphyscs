<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionsPivotTestCollection extends Model
{
    public $fillable = [
        'session_id',
        'test_collection_id',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function testCollection()
    {
        return $this->belongsTo(TestCollection::class);
    }
    
    use HasFactory;
}
