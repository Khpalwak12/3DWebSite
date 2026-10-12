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
        $locale = $request->input('locale', 'ps');
        $say = $this->messages(in_array($locale, ['ps', 'fa', 'en'], true) ? $locale : 'ps');

        $data = $request->validate([
            'guest_name' => ['required', 'string', 'min:2', 'max:80'],
            'phone' => ['required', 'string', 'regex:/^[0-9+\s()-]{9,20}$/'],
            'guests' => ['required', 'integer', 'min:1', 'max:12'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
            'dining_table_id' => ['required', 'integer', 'exists:dining_tables,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'guest_name.required' => $say['name.required'],
            'guest_name.min' => $say['name.min'],
            'phone.required' => $say['phone.required'],
            'phone.regex' => $say['phone.invalid'],
            'guests.required' => $say['guests.required'],
            'date.required' => $say['date.required'],
            'date.after_or_equal' => $say['date.past'],
            'time.required' => $say['time.required'],
            'time.date_format' => $say['time.invalid'],
            'dining_table_id.required' => $say['table.required'],
            'dining_table_id.exists' => $say['table.missing'],
        ]);

        $clock = Carbon::createFromFormat('H:i', $data['time']);
        $minutes = ($clock->hour * 60) + $clock->minute;

        if ($minutes < (12 * 60) || $minutes > (22 * 60) || $clock->minute % 30 !== 0) {
            throw ValidationException::withMessages([
                'time' => $say['time.range'],
            ]);
        }

        $start = Carbon::parse($data['date'].' '.$data['time']);

        if ($start->lte(now())) {
            throw ValidationException::withMessages([
                'time' => $say['time.past'],
            ]);
        }

        $reservation = DB::transaction(function () use ($data, $start, $say) {
            $table = DiningTable::query()->lockForUpdate()->findOrFail($data['dining_table_id']);

            if (! $table->is_active) {
                throw ValidationException::withMessages([
                    'dining_table_id' => $say['table.inactive'],
                ]);
            }

            if ($table->seats < $data['guests']) {
                throw ValidationException::withMessages([
                    'dining_table_id' => $say['table.small'],
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
                    'dining_table_id' => $say['table.taken'],
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

    private function messages(string $locale): array
    {
        $all = [
            'ps' => [
                'name.required' => 'نوم ولیکئ.',
                'name.min' => 'نوم لږ تر لږه دوه توري وي.',
                'phone.required' => 'د تلیفون شمېره ولیکئ.',
                'phone.invalid' => 'د تلیفون شمېره سمه نه ده.',
                'guests.required' => 'د میلمنو شمېر وټاکئ.',
                'date.required' => 'نېټه وټاکئ.',
                'date.past' => 'تېره نېټه نشي ټاکل کېدای.',
                'time.required' => 'وخت وټاکئ.',
                'time.invalid' => 'وخت سم نه دی.',
                'time.range' => 'مهرباني وکړئ د ۱۲:۰۰ او ۲۲:۰۰ ترمنځ، په نیم ساعت کې، وخت وټاکئ.',
                'time.past' => 'تېر شوی وخت نشي ټاکل کېدای.',
                'table.required' => 'له سالون څخه یو میز وټاکئ.',
                'table.missing' => 'دا میز ونه موندل شو.',
                'table.inactive' => 'دا میز فعال نه دی.',
                'table.small' => 'دا میز د دومره میلمنو لپاره کوچنی دی.',
                'table.taken' => 'دا میز په دې وخت کې نیول شوی دی.',
            ],
            'fa' => [
                'name.required' => 'نام را بنویسید.',
                'name.min' => 'نام حداقل دو حرف باشد.',
                'phone.required' => 'شماره تلفن را بنویسید.',
                'phone.invalid' => 'شماره تلفن درست نیست.',
                'guests.required' => 'شمار مهمان‌ها را انتخاب کنید.',
                'date.required' => 'تاریخ را انتخاب کنید.',
                'date.past' => 'تاریخ گذشته انتخاب نمی‌شود.',
                'time.required' => 'وقت را انتخاب کنید.',
                'time.invalid' => 'وقت درست نیست.',
                'time.range' => 'لطفاً بین ۱۲:۰۰ و ۲۲:۰۰، به فاصله نیم ساعت، وقت بگیرید.',
                'time.past' => 'وقت گذشته انتخاب نمی‌شود.',
                'table.required' => 'از سالون یک میز انتخاب کنید.',
                'table.missing' => 'این میز پیدا نشد.',
                'table.inactive' => 'این میز فعال نیست.',
                'table.small' => 'این میز برای این شمار مهمان کوچک است.',
                'table.taken' => 'این میز در این وقت گرفته شده است.',
            ],
            'en' => [
                'name.required' => 'Enter a name.',
                'name.min' => 'The name needs at least two letters.',
                'phone.required' => 'Enter a phone number.',
                'phone.invalid' => 'That phone number is not valid.',
                'guests.required' => 'Choose how many guests.',
                'date.required' => 'Choose a date.',
                'date.past' => 'A past date cannot be booked.',
                'time.required' => 'Choose a time.',
                'time.invalid' => 'That time is not valid.',
                'time.range' => 'Please choose a time between 12:00 and 22:00, on the half hour.',
                'time.past' => 'A time that has already passed cannot be booked.',
                'table.required' => 'Choose a table in the salon.',
                'table.missing' => 'That table could not be found.',
                'table.inactive' => 'That table is not in use.',
                'table.small' => 'That table is too small for this many guests.',
                'table.taken' => 'That table is already taken at this time.',
            ],
        ];

        return $all[$locale];
    }
}
