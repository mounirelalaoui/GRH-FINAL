<?php

use Illuminate\Foundation\Application;

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Laravel application instance
| which serves as the "glue" for all the components of Laravel, and is
| the IoC container for the system binding all of the various parts.
|
*/

$app = new Application($_ENV['APP_BASE_PATH'] ?? dirname(__DIR__));

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Here we will bind some important interfaces into the container so we
| will be able to resolve them when needed. These are used by the
| console and exception handling stack. We only bind what is present.
|
*/

if (class_exists(\App\Http\Kernel::class)) {
    $app->singleton(Illuminate\Contracts\Http\Kernel::class, \App\Http\Kernel::class);
}

if (class_exists(\App\Console\Kernel::class)) {
    $app->singleton(Illuminate\Contracts\Console\Kernel::class, \App\Console\Kernel::class);
}

if (class_exists(\App\Exceptions\Handler::class)) {
    $app->singleton(Illuminate\Contracts\Debug\ExceptionHandler::class, \App\Exceptions\Handler::class);
}

return $app;
