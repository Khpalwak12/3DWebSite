<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\SiteContent;

class ContentController extends Controller
{
    public function show()
    {
        $profile = Profile::query()->first();

        return response()->json([
            'profile' => [
                'phone' => $profile?->phone,
                'translations' => $profile?->translations,
                'hours' => $profile?->hours,
            ],
            'welcome' => SiteContent::read('welcome', [
                'text' => ['ps' => [], 'fa' => [], 'en' => []],
                'images' => ['left' => '/welcome-pizza.jpg', 'right' => '/welcome-platter.jpg'],
            ]),
            'tonight' => SiteContent::read('tonight', [
                'text' => ['ps' => [], 'fa' => [], 'en' => []],
            ]),
        ]);
    }
}
