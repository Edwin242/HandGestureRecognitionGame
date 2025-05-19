<?php 
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\TempScore;
use App\Models\MainScore;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Log; 


class ClaimController extends Controller
{
    public function show(Request $request)
    {
        $guid = $request->query('guid') ?? session('guid');
        $score = $request->query('score') ?? session('score');

        if (!$guid || !$score) {
            return view('side.edwin.claim', ['error' => 'Invalid GUID or score.']);
        }

        return view('side.edwin.claim', ['score' => $score, 'guid' => $guid]);
    } // claim page with GUID and score

    public function save(Request $request)
{
    if (!Auth::check()) {
        $scoreData = $request->only('guid', 'score');
        $request->session()->put('score_data', $scoreData);

        Log::info('Score data stored in session:', $scoreData);

        $request->session()->put('url.intended', route('claim.saveAfterLogin'));

        return redirect()->route('register');
    }

    return $this->saveScore($request);
}

    

    public function discard(Request $request)
    {
        $guid = $request->input('guid');
        $score = $request->input('score');
        TempScore::where('guid', $guid)->delete();

        return redirect()->route('claim.show', ['guid' => $guid, 'score' => $score])
            ->with('message', 'Your score has been discarded.');
    }


    public function saveAfterLogin(Request $request)
    {
        Log::info('Entered saveAfterLogin method.');
    
        if (!Auth::check()) {
            Log::warning('User not authenticated in saveAfterLogin.');
            return redirect()->route('login');
        }
    
        return $this->saveScore($request);
    }



    private function saveScore(Request $request)
{
    Log::info('Entered saveScore method.');

    $scoreData = $request->session()->pull('score_data');

    if (!$scoreData) {
        Log::error('No score data found in session.');
        return redirect()->route('dashboard')->with('error', 'No score data found.');
    }

    Log::info('Score data retrieved from session:', $scoreData);

    $guid = $scoreData['guid'];
    $score = $scoreData['score'];

    $tempScore = TempScore::where('guid', $guid)->first();

    if ($tempScore) {
        Log::info('TempScore found:', ['tempScore' => $tempScore->toArray()]);

        try {
            MainScore::create([
                'user_id' => Auth::id(),
                'guid' => $tempScore->guid,
                'score' => $tempScore->score,
                'unix_timestamp' => $tempScore->unix_timestamp,
            ]);

            $tempScore->delete();
            Log::info('TempScore deleted.');

            $request->session()->forget(['guid', 'score']);

            return redirect()->route('dashboard')->with('message', 'Your score has been saved!'); // 
        } catch (\Exception $e) {
            Log::error('Error saving score: ' . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'An error occurred while saving your score.');
        }
    } else {
        Log::error('TempScore not found for GUID: ' . $guid);
        return redirect()->route('dashboard')->with('message', 'Your score has been saved!');
    }
}

    
    public function showLeaderboard()
    {
        $scores = MainScore::with('user')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get();

        return view('side.edwin.dashboard', compact('scores'));
    }
    

}

// user tries to save or discard their score, controller handles the incoming requests, 
// validates the provided GUID and score, and then either saves the score to the session or removes it 
// based on the user's choice. 
// stores the user's score in the session. 
