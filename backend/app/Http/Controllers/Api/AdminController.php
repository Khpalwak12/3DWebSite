<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Profile;
use App\Models\Reservation;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $expected = (string) config('admin.password');

        if ($expected === '' || ! hash_equals($expected, $data['password'])) {
            return response()->json(['message' => 'پټنوم سم نه دی.'], 422);
        }

        return response()->json([
            'token' => hash_hmac('sha256', 'dastarkhwan-admin', (string) config('app.key')),
        ]);
    }

    public function catalog()
    {
        $categories = Category::query()
            ->with(['menuItems' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->name,
                'description' => $category->description,
                'translations' => $category->translations,
                'items' => $category->menuItems->map(fn (MenuItem $item) => [
                    'id' => $item->id,
                    'slug' => $item->slug,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => (float) $item->price,
                    'featured' => $item->is_featured,
                    'spice' => $item->spice,
                    'translations' => $item->translations,
                    'images' => $item->images ?? [],
                ])->values(),
            ])->values(),
        ]);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'translations' => ['required', 'array'],
            'translations.ps.name' => ['required', 'string', 'max:120'],
            'translations.fa.name' => ['nullable', 'string', 'max:120'],
            'translations.en.name' => ['nullable', 'string', 'max:120'],
            'translations.ps.description' => ['nullable', 'string', 'max:255'],
            'translations.fa.description' => ['nullable', 'string', 'max:255'],
            'translations.en.description' => ['nullable', 'string', 'max:255'],
        ]);

        $category->update([
            'name' => $data['translations']['ps']['name'],
            'description' => $data['translations']['ps']['description'] ?? '',
            'translations' => $data['translations'],
        ]);

        return response()->json(['ok' => true]);
    }

    public function updateItem(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'price' => ['required', 'numeric', 'min:0', 'max:100000'],
            'featured' => ['required', 'boolean'],
            'spice' => ['required', 'integer', 'min:0', 'max:3'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['string', 'max:255'],
            'translations' => ['required', 'array'],
            'translations.ps.name' => ['required', 'string', 'max:120'],
            'translations.fa.name' => ['nullable', 'string', 'max:120'],
            'translations.en.name' => ['nullable', 'string', 'max:120'],
            'translations.ps.description' => ['nullable', 'string', 'max:500'],
            'translations.fa.description' => ['nullable', 'string', 'max:500'],
            'translations.en.description' => ['nullable', 'string', 'max:500'],
        ]);

        $images = collect($data['images'] ?? [])
            ->filter(fn ($path) => is_string($path) && str_starts_with($path, '/'))
            ->values()
            ->all();

        $menuItem->update([
            'name' => $data['translations']['ps']['name'],
            'description' => $data['translations']['ps']['description'] ?? '',
            'price' => $data['price'],
            'is_featured' => $data['featured'],
            'spice' => $data['spice'],
            'translations' => $data['translations'],
            'images' => $images,
        ]);

        return response()->json(['ok' => true]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'max:40'],
            'hours' => ['required', 'array', 'min:1', 'max:7'],
            'hours.*.time' => ['required', 'string', 'max:40'],
            'hours.*.days' => ['required', 'array'],
            'hours.*.days.ps' => ['required', 'string', 'max:80'],
            'hours.*.days.fa' => ['nullable', 'string', 'max:80'],
            'hours.*.days.en' => ['nullable', 'string', 'max:80'],
            'translations' => ['required', 'array'],
        ]);

        $profile = Profile::query()->firstOrFail();
        $ps = $data['translations']['ps'] ?? [];

        $profile->update([
            'phone' => $data['phone'],
            'hours' => $data['hours'],
            'name' => $ps['brand'] ?? $profile->name,
            'tagline' => $ps['tagline'] ?? $profile->tagline,
            'hero_note' => $ps['heroNote'] ?? $profile->hero_note,
            'about' => $ps['about'] ?? $profile->about,
            'address' => $ps['address'] ?? $profile->address,
            'city' => $ps['city'] ?? $profile->city,
            'translations' => $data['translations'],
        ]);

        return response()->json(['ok' => true]);
    }

    public function updateBlock(Request $request, string $key)
    {
        if (! in_array($key, ['welcome', 'tonight'], true)) {
            return response()->json(['message' => 'دا برخه ونه موندل شوه.'], 404);
        }

        $data = $request->validate([
            'text' => ['required', 'array'],
            'images' => ['nullable', 'array'],
            'images.left' => ['nullable', 'string', 'max:255'],
            'images.right' => ['nullable', 'string', 'max:255'],
        ]);

        $value = ['text' => $data['text']];
        if ($key === 'welcome') {
            $value['images'] = [
                'left' => $data['images']['left'] ?? '/welcome-pizza.jpg',
                'right' => $data['images']['right'] ?? '/welcome-platter.jpg',
            ];
        }

        SiteContent::put($key, $value);

        return response()->json(['ok' => true]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $file = $request->file('image');
        $name = Str::uuid()->toString().'.'.$file->extension();
        $directory = public_path('uploads');

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $file->move($directory, $name);

        return response()->json(['url' => '/uploads/'.$name]);
    }

    public function reservations()
    {
        $rows = Reservation::query()
            ->with('diningTable')
            ->latest('reserved_at')
            ->limit(40)
            ->get();

        return response()->json([
            'reservations' => $rows->map(fn (Reservation $row) => [
                'id' => $row->id,
                'guest_name' => $row->guest_name,
                'phone' => $row->phone,
                'guests' => $row->guests,
                'reserved_at' => $row->reserved_at?->format('Y-m-d H:i'),
                'notes' => $row->notes,
                'status' => $row->status,
                'table' => $row->diningTable?->label,
            ])->values(),
        ]);
    }
}
