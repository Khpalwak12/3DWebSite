<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\InfoController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\TableController;
use Illuminate\Support\Facades\Route;

Route::get('/info', [InfoController::class, 'show']);
Route::get('/content', [ContentController::class, 'show']);
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/tables', [TableController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);

Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('admin')->prefix('admin')->group(function () {
    Route::get('/catalog', [AdminController::class, 'catalog']);
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
    Route::put('/items/{menuItem}', [AdminController::class, 'updateItem']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::put('/blocks/{key}', [AdminController::class, 'updateBlock']);
    Route::post('/upload', [AdminController::class, 'upload']);
    Route::get('/reservations', [AdminController::class, 'reservations']);
});
