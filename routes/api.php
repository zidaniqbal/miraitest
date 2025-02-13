<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiaryController;
use App\Http\Controllers\ZipcodeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user()
        ]);
    });

    // Logout route
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Zipcode routes
    Route::get('/zipcode', [ZipcodeController::class, 'index']);
    Route::post('/zipcode', [ZipcodeController::class, 'store']);

    Route::apiResource('diaries', DiaryController::class);
});
