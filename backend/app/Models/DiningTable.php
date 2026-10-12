<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['label', 'seats', 'pos_x', 'pos_z', 'shape', 'is_active', 'sort_order'])]
class DiningTable extends Model
{
    protected function casts(): array
    {
        return [
            'seats' => 'integer',
            'pos_x' => 'float',
            'pos_z' => 'float',
            'is_active' => 'boolean',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
