<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiningTable;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name' => ['required', 'string', 'min:2', 'max:80'],
            'phone' => ['required', 'string', 'regex:/^[0-9+\s()-]{9,20}$/'],
            'guests' => ['required', 'integer', 'min:1', 'max:12'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
            'dining_table_id' => ['required', 'integer', 'exists:dining_tables,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'guest_name.required' => 'نوم ولیکئ.',
            'guest_name.min' => 'نوم لږ تر لږه دوه توري وي.',
            'phone.required' => 'د تلیفون شمېره ولیکئ.',
            'phone.regex' => 'د تلیفون شمېره سمه نه ده.',
            'guests.required' => 'د میلمنو شمېر وټاکئ.',
            'date.required' => 'نېټه وټاکئ.',
            'date.after_or_equal' => 'تېره نېټه نشي ټاکل کېدای.',
            'time.required' => 'وخت وټاکئ.',
            'time.date_format' => 'وخت سم نه دی.',
            'dining_table_id.required' => 'له سالون څخه یو میز وټاکئ.',
            'dining_table_id.exists' => 'دا میز ونه موندل شو.',
        ]);

        $clock = Carbon::createFromFormat('H:i', $data['time']);
        $minutes = ($clock->hour * 60) + $clock->minute;

        if ($minutes < (12 * 60) || $minutes > (22 * 60) || $clock->minute % 30 !== 0) {
            throw ValidationException::withMessages([
                'time' => 'مهرباني وکړئ د ۱۲:۰۰ او ۲۲:۰۰ ترمنځ، په نیم ساعت کې، وخت وټاکئ.',
            ]);
        }

        $start = Carbon::parse($data['date'].' '.$data['time']);

        if ($start->lte(now())) {
            throw ValidationException::withMessages([
                'time' => 'تېر شوی وخت نشي ټاکل کېدای.',
            ]);
        }

        $reservation = DB::transaction(function () use ($data, $start) {
            $table = DiningTable::query()->lockForUpdate()->findOrFail($data['dining_table_id']);

            if (! $table->is_active) {
                throw ValidationException::withMessages([
                    'dining_table_id' => 'دا میز فعال نه دی.',
                ]);
            }

            if ($table->seats < $data['guests']) {
                throw ValidationException::withMessages([
                    'dining_table_id' => 'دا میز د دومره میلمنو لپاره کوچنی دی.',
                ]);
            }

            $taken = Reservation::query()
                ->where('dining_table_id', $table->id)
                ->where('status', '!=', 'cancelled')
                ->where('reserved_at', '<', $start->copy()->addMinutes(90))
                ->where('reserved_at', '>', $start->copy()->subMinutes(90))
                ->lockForUpdate()
                ->exists();

            if ($taken) {
                throw ValidationException::withMessages([
                    'dining_table_id' => 'دا میز په دې وخت کې نیول شوی دی.',
                ]);
            }

            return Reservation::query()->create([
                'dining_table_id' => $table->id,
                'guest_name' => $data['guest_name'],
                'phone' => $data['phone'],
                'guests' => $data['guests'],
                'reserved_at' => $start,
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
            ])->setRelation('diningTable', $table);
        });

        return response()->json([
            'reservation' => [
                'id' => $reservation->id,
                'guest_name' => $reservation->guest_name,
                'phone' => $reservation->phone,
                'guests' => $reservation->guests,
                'reserved_at' => $reservation->reserved_at->format('Y-m-d H:i'),
                'table' => $reservation->diningTable->label,
                'seats' => $reservation->diningTable->seats,
                'status' => $reservation->status,
            ],
        ], 201);
    }
}
