<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'tagline', 'hero_note', 'about', 'phone', 'address', 'city', 'hours', 'translations'])]
class Profile extends Model
{
    protected function casts(): array
    {
        return [
            'hours' => 'array',
            'translations' => 'array',
        ];
    }
}
