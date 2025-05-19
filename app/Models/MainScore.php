<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;



class MainScore extends Model
{
    use HasFactory;


    protected $fillable = [ //database table names
        'user_id',
        'guid',
        'score',
        'unix_timestamp',
    ];
    public function user()
    {
        // return $this->belongsTo(User::class); // links each score to a single user
        return $this->belongsTo(User::class, 'user_id');

    }
}
// will run on the server
// create, update and delete records of user final scores
// "protected $fillable" will be recorded. Identify each score entry and record the time it was achieved.
