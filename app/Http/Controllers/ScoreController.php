<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\TempScore;
use App\Models\MainScore;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class ScoreController extends Controller
{
    public function storeTempScore (Request $request)
    {
        $validatedData = $request->validate([ 
            'score' => 'required|integer',
        ]);
        $guid = (string) Str::uuid();
        $unixTimestamp = now()->timestamp;
        $userId = Auth::check() ? Auth::id() : null;
        $tempScore = TempScore::create([ // creates a new tempscore record
            'guid' => $guid,
            'score' =>$validatedData['score'],  
            'unix_timestamp' => $unixTimestamp,
            'user_id' => $userId,
        ]);
        return response()->json([ // returns a JSON so temp score was saved
            'message' => 'Temporary score saved',
            'temp_score_id' => $tempScore->id,
            'guid' => $tempScore->guid,

        ], 201); // ???code 201 indicates that a resource was created????
    }

    public function claimScore(Request $request)
    {
        $guid = $request->query('guid');
        $tempScore = TempScore::where('guid', $guid)->first(); 
        if($tempScore){
            $mainScore = MainScore::create([ 
                'guid' => $tempScore->guid, 
                'score' => $tempScore->score,
                'unix_timestamp' => $tempScore->unix_timestamp,
                'user_id' => $tempScore->user_id,
            ]);
            $tempScore->delete(); 
            return response()->json(['message' => 'Score claimed and moved to MainScore.']);
        }else {
            return response()->json(['message' => 'Score not found.'], 404);
        }
    }

    public function showLeaderboard()
    {
        $scores = MainScore::with('user')
            ->orderBy('score', 'desc')
            ->get();

        return view('side.edwin.leaderboard', compact('scores'));


        
        $topScores = MainScore::orderBy('score', 'desc')->take(5)->get();
        return view('mab-project', compact('topScores'));
    }


    public function saveScore(Request $request)
    {
        $request->validate([
            'guid' => 'required',
            'score' => 'required|integer',
        ]);

        $score = new MainScore();
        $score->guid = $request->guid;
        $score->score = $request->score;
        $score->save();

        return redirect()->route('leaderboard');
    }

    public function discardScore(Request $request)
    {
        return redirect()->route('claim');
    }

    public function dashboard()
    {
        $scores = MainScore::with('user')
            ->orderBy('score', 'desc')
            ->get();
    
        return view('dashboard', compact('scores'));
    }



    public function submitScore(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'guid' => 'required|uuid|unique:main_scores,guid',
            'score' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $guid = $request->input('guid');
        $score = $request->input('score'); 

        // Create a new MainScore
        $mainScore = new MainScore();
        $mainScore->guid = $guid;
        $mainScore->score = $score;
        $mainScore->unix_timestamp = time();

        if (Auth::check()) {
            $mainScore->user_id = Auth::id();
        } else {
            $mainScore->user_id = null;
        }

        $mainScore->save();

        return response()->json([
            'success' => true,
            'message' => 'Score submitted successfully.',
            'guid' => $mainScore->guid,
        ]);
    } catch (\Exception $e) {
        Log::error('Error in submitScore: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while submitting the score.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    
    
    public function showGame()
    {
        $topScores = Score::orderBy('score', 'desc')->take(5)->get();

        return view('game', ['topScores' => $topScores]);
    }

}

// storage and management of users' scores
// scores are correctly validated, associated with the right user
// The claimScore method retrieves a temporary score based on the GUID, 
// transfers it to the main_scores table, deletes the temporary record,