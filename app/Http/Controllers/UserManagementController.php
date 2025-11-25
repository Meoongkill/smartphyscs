<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;


class UserManagementController extends Controller
{
    // show all user
    public function index()
    {
        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })->with('roles')->get();

        // dd($users);

        return Inertia::render('Admin/KelolaUser/Index', [
            'users' => $users
        ]);
    }

    // insert user to database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'nik' => 'required|unique:users,nik',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        // insert user to database with role == user
        $user = User::create([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'password' => bcrypt($request->password),
            'foto' => $request->foto
        ]);

        // assign role user to user
        $user->assignRole('user');
        $message = 'Peserta berhasil ditambahkan';

        return response()->json([
            'message' => $message,
            'error' => false,
        ]);
    }

    // update user
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'nik' => 'required',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        // update user
        User::where('id', $request->id)->update([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        session()->flash('message', 'User berhasil diperbarui.');
        session()->flash('type', 'success');
        return redirect()->route('admin.userManagement');
    }
}
