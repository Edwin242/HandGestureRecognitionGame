<!DOCTYPE html>
<html>
<head>
    <title>Leaderboard</title>
    @vite('resources/side/edwin/leaderboard/css/style.css')
    <!-- @vite('resources/side/edwin/leaderboard/js/leaderboard.css') -->
    <link rel="stylesheet" href="{{ asset('css/leaderboard.css') }}">
</head>
<body>
    <div class="container">
        <h1>Leaderboard</h1>

        @if(session('message'))
            <div class="message">
                {{ session('message') }}
            </div>
        @endif

        @if(isset($scores) && $scores->count() > 0)
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            @foreach($scores as $index => $score)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $score->user->name ?? 'Anonymous' }}</td>
                    <td>{{ $score->score }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p>No scores available.</p>
@endif

    </div>
</body>
</html>
