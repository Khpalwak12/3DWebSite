<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'دسترخوان',
        'api' => url('/api/info'),
        'app' => 'http://localhost:5173',
    ]);
});
