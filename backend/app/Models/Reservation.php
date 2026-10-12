<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['dining_table_id', 'guest_name', 'phone', 'guests', 'reserved_at', 'notes', 'status'])]
class Reservation extends Model
{
    protected function casts(): array
    {
        return [
            'guests' => 'integer',
            'reserved_at' => 'datetime',
        ];
    }

    public function diningTable(): BelongsTo
    {
        return $this->belongsTo(DiningTable::class);
    }
}
