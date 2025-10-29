<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }
    public function createadmin(): Response
    {
        return Inertia::render('Auth/LoginAdmin', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $roles = $user->getRoleNames();

            if (count($roles) > 0) {
                $userRole = $roles[0];
                $requestedRole = $request->role;

                if ($userRole != $requestedRole) {
                    // return response error
                    return redirect()->back()->withErrors(['error' => 'Role tidak sesuai!']);
                }

                $request->authenticate();
                $request->session()->regenerate();

                return redirect()->intended(RouteServiceProvider::HOME);
            }
        } else {
            return redirect()->back()->withErrors(['error' => 'Akun tidak terdaftar!']);
        }
    }

    // public function storeadmin(LoginRequest $request): RedirectResponse
    // {
    //     try {
    //         $request->authenticate();
    //         $request->session()->regenerate();

    //         return redirect()->intended(RouteServiceProvider::HOME);
    //     } catch (\Throwable $e) {
    //         dd($e);
    //         return redirect()->back()->with('error', 'Akun tidak terdaftar');
    //     }
    // }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
