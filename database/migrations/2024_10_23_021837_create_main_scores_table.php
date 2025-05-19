<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('main_scores', function (Blueprint $table) {
            $table->id();
            $table->uuid('guid')->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->integer('score');
            $table->unsignedBigInteger('unix_timestamp');
            $table->timestamps();
        
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        
    }

    public function down(): void
    {
        Schema::dropIfExists('main_scores');
    }
};

// stores users' final game scores permanently. 
// Columns for the score ID, user ID, the actual score, a unique GUID for each score, 
// timestamp indicating when the score was achieved. 
// ID (primary key), user_id (foreign key linking to the users table),
