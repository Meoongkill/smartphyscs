<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */


    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // dd($request->all());
        try {
            $request->validate([
                'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                // tambahkan aturan validasi lainnya sesuai kebutuhan
            ]);

            if ($request->hasFile('foto')) {
                $originalName = $request->file('foto')->getClientOriginalName();

                if ($request->user()->foto) {
                    $oldFotoPath = public_path('foto') . '/' . $request->user()->foto;
                    if (File::exists($oldFotoPath)) {
                        File::delete($oldFotoPath);
                    }
                }

                $request->user()->update([
                    'foto' => $originalName,
                    // tambahkan kolom lainnya sesuai kebutuhan
                ]);

                $request->file('foto')->move(public_path('foto'), $originalName);
            }
        } catch (\Exception $e) {
            // return $e->getMessage();
        }
        $request->user()->fill($request->validated());
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
