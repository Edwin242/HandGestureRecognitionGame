<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register()
    {
    }

    public function boot()
    {

        Fortify::authenticateUsing(function ($request) {
            return null;
        });

    }
}
