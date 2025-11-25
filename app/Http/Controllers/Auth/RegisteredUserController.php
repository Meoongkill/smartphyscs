<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function createp(): Response
    {
        return Inertia::render('Auth/RegisterPsikolog');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $originalName = $request->file('foto')->getClientOriginalName();
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Sesuaikan validasi dengan kebutuhan
        ]);

        $user = User::create([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'foto' => $originalName,
            'password' => Hash::make($request->password),
        ]);

        // Simpan foto ke penyimpanan (public storage)
        $fotoPath = $request->file('foto')->move(public_path('foto'), $originalName);

        $user->assignRole('user');
        $user->update(['foto' => $originalName]);
        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
