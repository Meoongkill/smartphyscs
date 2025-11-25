<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PsikologManagementController extends Controller
{
    // show all psikolog
    public function index()
    {
        $psikologs = User::whereHas('roles', function ($query) {
            $query->where('name', 'psikolog');
        })->with(['roles', 'assignedSessions'])->get();

        $sessions = Session::where('is_active', true)->get();

        return Inertia::render('Admin/KelolaPsikolog/Index', [
            'data' => $psikologs,
            'sessions' => $sessions
        ]);
    }

    // store new psikolog
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'nik' => 'nullable|unique:users,nik',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
            'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'assigned_sessions' => 'nullable|array',
        ]);

        $signaturePath = null;
        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        // insert psikolog to database with role == psikolog
        $psikolog = User::create([
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'password' => bcrypt($request->password),
            'foto' => $request->foto,
            'signature' => $signaturePath
        ]);

        // assign role psikolog to psikolog
        $psikolog->assignRole('psikolog');

        // Assign sessions
        if ($request->assigned_sessions) {
            $psikolog->assignedSessions()->sync($request->assigned_sessions);
        }

        $message = 'Psikolog berhasil ditambahkan';

        return response()->json([
            'message' => $message,
            'error' => false,
        ]);
    }

    // update psikolog
    public function update(Request $request)
    {
        Log::info('Update Psikolog Request:', $request->all());

        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'nik' => 'nullable',
            'nohp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable',
            'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sessions' => 'nullable|array',
            'sessions.*' => 'exists:sessions,id',
        ]);

        $psikolog = User::find($request->id);

        if (!$psikolog) {
            return redirect()->back()->with('error', 'Psikolog tidak ditemukan');
        }

        $updateData = [
            'name' => $request->name,
            'nik' => $request->nik,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ];

        // Handle signature upload
        if ($request->hasFile('signature')) {
            Log::info('Uploading signature file');
            // Delete old signature if exists
            if ($psikolog->signature) {
                Storage::disk('public')->delete($psikolog->signature);
            }
            $updateData['signature'] = $request->file('signature')->store('signatures', 'public');
        }

        $psikolog->update($updateData);
        Log::info('Psikolog updated:', $updateData);

        // Update assigned sessions
        if ($request->has('sessions')) {
            Log::info('Syncing sessions:', $request->sessions);
            $psikolog->assignedSessions()->sync($request->sessions);
        } else {
            Log::info('No sessions provided, clearing all');
            // If no sessions sent, clear all assignments
            $psikolog->assignedSessions()->sync([]);
        }

        return redirect()->route('admin.psikologManagement')
            ->with('message', 'Psikolog berhasil diperbarui.')
            ->with('type', 'success');
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
