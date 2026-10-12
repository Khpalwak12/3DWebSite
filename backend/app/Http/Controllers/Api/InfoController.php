<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;

class InfoController extends Controller
{
    public function show()
    {
        $profile = Profile::query()->firstOrFail();

        return response()->json([
            'name' => $profile->name,
            'tagline' => $profile->tagline,
            'hero_note' => $profile->hero_note,
            'about' => $profile->about,
            'phone' => $profile->phone,
            'address' => $profile->address,
            'city' => $profile->city,
            'hours' => $profile->hours,
        ]);
    }
}
