<?php

use App\Http\Controllers\Api\InfoController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\TableController;
use Illuminate\Support\Facades\Route;

Route::get('/info', [InfoController::class, 'show']);
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/tables', [TableController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
