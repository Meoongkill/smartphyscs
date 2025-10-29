<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class PsikologManagementController extends Controller
{
    // show all psikolog
    public function index()
    {
        $psikologs = User::whereHas('roles', function ($query) {
            $query->where('name', 'psikolog');
        })->with('roles')->get();

        // dd($psikologs);

        return Inertia::render('Admin/KelolaPsikolog/Index', [
            'data' => $psikologs
        ]);
    }

    // store new psikolog
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'nik' => 'nullable|unique:users,nik',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        // insert psikolog to database with role == psikolog
        $psikolog = User::create([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'password' => bcrypt($request->password),
            'foto' => $request->foto
        ]);

        // assign role psikolog to psikolog
        $psikolog->assignRole('psikolog');
        $message = 'Psikolog berhasil ditambahkan';

        return response()->json([
            'message' => $message,
            'error' => false,
        ]);
    }

    // update psikolog
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'nik' => 'nullable',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        $psikolog = User::find($request->id);
        $psikolog->update([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        session()->flash('message', 'Psikolog berhasil diperbarui.');
        session()->flash('type', 'success');
        return redirect()->route('admin.psikologManagement');
    }

    // delete psikolog
    public function destroy(Request $request)
    {
        $psikolog = User::find($request->id);
        $psikolog->delete();

        session()->flash('message', 'Psikolog berhasil dihapus.');
        session()->flash('type', 'success');
        return redirect()->route('admin.psikologManagement');
    }
}
