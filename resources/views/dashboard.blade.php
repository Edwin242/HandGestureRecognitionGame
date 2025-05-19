<x-app-layout>
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <x-slot name="header">
        <h2 class="font-semibold text-xl">
            <!-- {{ __('Dashboard') }} -->
        </h2>
    </x-slot>

    <div class="container mx-auto py-12">
        <h1 class="text-2xl font-bold text-white mb-4">All Scores</h1>
        @if($scores->count() > 0)
            <table class="min-w-full bg-white">
                <thead>
                    <tr>
                        <th class="py-2">Rank</th>
                        <th class="py-2">User</th>
                        <th class="py-2">Score</th>
                        <th class="py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($scores as $index => $score)
                        <tr class="{{ $index % 2 == 0 ? 'bg-gray-100' : '' }}">
                            <td class="py-2 text-center">{{ $index + 1 }}</td>
                            <td class="py-2 text-center">
                                {{ $score->user->name ?? 'Anonymous' }}
                            </td>
                            <td class="py-2 text-center">{{ $score->score }}</td>
                            <td class="py-2 text-center">
                                {{ \Carbon\Carbon::createFromTimestamp($score->unix_timestamp)->format('Y-m-d H:i:s') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No scores available.</p>
        @endif
    </div>
</x-app-layout>
