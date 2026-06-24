<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\Api\CongeController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\EtablissementController;
use App\Http\Controllers\Api\SpecialiteController;
use App\Http\Controllers\Api\DiplomeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

// ── Public ──
Route::post('/login', [AuthController::class, 'login']);

// ── Protégées ──
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get ('/me',              [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::prefix('dashboard')->group(function () {
        Route::get('/stats',        [DashboardController::class, 'stats']);
        Route::get('/charts',       [DashboardController::class, 'charts']);
        Route::get('/recent',       [DashboardController::class, 'recent']);
        Route::get('/top-absences', [DashboardController::class, 'topAbsences']);
    });

    Route::apiResource('personnels', PersonnelController::class);
    Route::get('personnels/{id}/conges',      [PersonnelController::class, 'conges']);
    Route::get('personnels/{id}/absences',    [PersonnelController::class, 'absences']);
    Route::get('personnels/{id}/diplomes',    [PersonnelController::class, 'diplomes_']);
    Route::get('personnels/{id}/specialites', [PersonnelController::class, 'specialites_']);

    Route::apiResource('conges', CongeController::class);
    Route::patch('conges/{id}/statut', [CongeController::class, 'updateStatut']);

    Route::get('absences/stats', [AbsenceController::class, 'stats']);
    Route::apiResource('absences', AbsenceController::class);

    Route::apiResource('etablissements', EtablissementController::class);
    Route::apiResource('specialites',    SpecialiteController::class);
    Route::apiResource('diplomes',       DiplomeController::class);

    Route::middleware('role:directeurducomlex')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('users/{id}/password', [UserController::class, 'resetPassword']);
        Route::patch('users/{id}/toggle',   [UserController::class, 'toggleActive']);
    });
});
