<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Your Score</title>
    @vite('resources/side/edwin/claim/css/style.css')
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 font-sans">
    <div class="min-h-screen flex items-start justify-center pt-16">
        <div class="bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-white text-center mb-6">Claim Your Score</h1>

            @if(session('message'))
                <div class="bg-green-500 text-white p-4 rounded mb-4">
                    {{ session('message') }}
                </div>
            @endif

            @if(isset($error))
                <div class="bg-red-500 text-white p-4 rounded mb-4">
                    {{ $error }}
                </div>
            @elseif(isset($score) && isset($guid))
                <div class="mb-4">
                    <p class="mb-2"><strong>Your Score:</strong> {{ $score }}</p>
                    <p><strong>GUID:</strong> {{ $guid }}</p>
                </div>

                @auth
                    <div class="flex space-x-4">
                        <form method="POST" action="{{ route('claim.save') }}" class="w-1/2">
                            @csrf
                            <input type="hidden" name="guid" value="{{ $guid }}">
                            <input type="hidden" name="score" value="{{ $score }}">
                            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Save
                            </button>
                        </form>

                        <form method="POST" action="{{ route('claim.discard') }}" class="w-1/2">
                            @csrf
                            <input type="hidden" name="guid" value="{{ $guid }}">
                            <input type="hidden" name="score" value="{{ $score }}">
                            <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                Discard
                            </button>
                        </form>
                    </div>
                @else
                    <div class="bg-gray-700 p-4 rounded mt-6">
                        <p class="text-center">
                            Please 
                            <a href="{{ route('login') }}" class="text-blue-400 hover:underline">log in</a> 
                            or 
                            <a href="{{ route('register') }}" class="text-blue-400 hover:underline">create an account</a> 
                            to save your score.
                        </p>
                    </div>
                @endauth
            @else
                <p class="text-center">Loading...</p>
            @endif
        </div>
    </div>
</body>
</html>
