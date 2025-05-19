<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MainScore;

class LeaderboardController extends Controller
{
    public function index()
    {
        $topScores = MainScore::with('user')
            ->orderBy('score', 'desc')
            ->limit(5)
            ->get();

        return view('side.edwin.mab-project', compact('topScores'));
    }
}
