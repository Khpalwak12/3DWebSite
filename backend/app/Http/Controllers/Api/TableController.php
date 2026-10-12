<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiningTable;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'date' => ['nullable', 'date'],
            'time' => ['nullable', 'date_format:H:i'],
            'guests' => ['nullable', 'integer', 'min:1', 'max:12'],
        ]);

        $tables = DiningTable::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $takenIds = collect();

        if (! empty($data['date']) && ! empty($data['time'])) {
            $start = Carbon::parse($data['date'].' '.$data['time']);
            $takenIds = Reservation::query()
                ->where('status', '!=', 'cancelled')
                ->where('reserved_at', '<', $start->copy()->addMinutes(90))
                ->where('reserved_at', '>', $start->copy()->subMinutes(90))
                ->pluck('dining_table_id');
        }

        return response()->json([
            'tables' => $tables->map(function (DiningTable $table) use ($takenIds, $data) {
                $guests = $data['guests'] ?? null;
                $taken = $takenIds->contains($table->id);
                $fits = $guests === null || $table->seats >= (int) $guests;

                return [
                    'id' => $table->id,
                    'label' => $table->label,
                    'seats' => $table->seats,
                    'x' => $table->pos_x,
                    'z' => $table->pos_z,
                    'shape' => $table->shape,
                    'available' => ! $taken && $fits,
                    'reason' => $taken ? 'taken' : (! $fits ? 'small' : null),
                ];
            })->values(),
        ]);
    }
}
