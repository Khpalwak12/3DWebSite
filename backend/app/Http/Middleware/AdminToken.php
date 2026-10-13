<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = (string) $request->bearerToken();
        $expected = hash_hmac('sha256', 'dastarkhwan-admin', (string) config('app.key'));

        if ($token === '' || ! hash_equals($expected, $token)) {
            return response()->json(['message' => 'اجازه نشته. بیا ننوځئ.'], 401);
        }

        return $next($request);
    }
}
