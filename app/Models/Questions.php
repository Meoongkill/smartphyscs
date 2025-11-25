<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    public $fillable = [
        'kode',
        'pertanyaan',
        'dimensi',
        'type',
        'key_answer',
        'order',
        'is_active',
        'file_path',
    ];
    use HasFactory;
}
