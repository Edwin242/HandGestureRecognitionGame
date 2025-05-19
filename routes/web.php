<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ScoreController; //this is for the tempscore table
use App\Http\Controllers\ClaimController; //this if for save and discard scores
use Illuminate\Support\Str;
use App\Models\TempScore;
use App\Http\Controllers\LeaderboardController;




Route::middleware(['web'])->group(function () {


Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});





Route::get('/side/edwin/mab-project', function () {
    return view('side/edwin/mab-project');
});

Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);


Route::post('/submit-score', [ScoreController::class, 'submitScore']);



// Route to share the score for the temp score table
Route::get('/share', [ScoreController::class, 'shareScore'])->name('score.share');

// Routes for the claim process
Route::get('/claim', [ClaimController::class, 'show'])->name('claim.show');
Route::post('/claim/save', [ClaimController::class, 'save'])->name('claim.save');

Route::post('/claim/discard', [ClaimController::class, 'discard'])->name('claim.discard');

// Route for the leaderboard
// Route::get('/dashboard', [ScoreController::class, 'showLeaderboard'])->name('dashboard');






Route::get('/claim/save-after-login', [ClaimController::class, 'saveAfterLogin'])->name('claim.saveAfterLogin');



// Route::get('/dashboard', [ScoreController::class, 'dashboard'])->name('dashboard');

Route::get('/dashboard', [ScoreController::class, 'dashboard'])->name('dashboard')->middleware('auth');

//Some test routes
Route::get('/test-save-temp-score', function () {
    $guid = (string) Str::uuid();
    TempScore::create([
        'guid' => $guid,
        'score' => 1000,
        'unix_timestamp' => time(),
    ]);
    return "Temp score saved with GUID: $guid";
});






Route::get('/mab-project', [ScoresController::class, 'showLeaderboard']);







Route::get('/mab-project', [GameController::class, 'showGame']);


Route::get('/mab-project', [LeaderboardController::class, 'index'])->name('mab-project');

Route::get('/side/edwin/mab-project', [LeaderboardController::class, 'index'])->name('mab-project');


Route::post('/submit-score', [ScoreController::class, 'submitScore'])->name('submit.score');

Route::post('/submit-score', [ScoreController::class, 'submitScore']);

Route::post('/submit-score', [ScoreController::class, 'submitScore'])->name('submit-score');




require __DIR__.'/auth.php';


});