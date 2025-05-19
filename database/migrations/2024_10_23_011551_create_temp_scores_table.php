<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('temp_scores', function (Blueprint $table) {
        $table->id();
        $table->uuid('guid')->unique();
        $table->integer('score');
        $table->unsignedBigInteger('unix_timestamp');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('temp_score');
    }
};

// Stores users' scores temporarily 
// Contains columns for the temporary score ID, user ID, the score itself, a unique GUID, and a timestamp. 
// only confirmed scores are moved to the main_scores table for permanent storage.