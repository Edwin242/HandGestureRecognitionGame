<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class TempScore extends Model
{
    // protected $table = 'temp_scores';
    protected $fillable = [
        'guid',
        'score',
        'unix_timestamp',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

