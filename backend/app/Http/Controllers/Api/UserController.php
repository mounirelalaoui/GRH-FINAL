<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller {
    public function index()           { return response()->json(User::with('personnel')->orderBy('username')->get()); }
    public function store(Request $r) {
        $data = $r->validate([
            'username'    => 'required|string|unique:users',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|string|min:8',
            'Role'        => 'required|in:directeurducomlex,gestionnairecfmr',
            'idPersonnel' => 'nullable|exists:personnels,idPersonnel|unique:users,idPersonnel',
        ]);
        $data['password'] = Hash::make($data['password']);
        $data['active']   = true;
        return response()->json(User::create($data)->load('personnel'), 201);
    }
    public function show($id)         { return response()->json(User::with('personnel')->findOrFail($id)); }
    public function update(Request $r, $id) {
        $u = User::findOrFail($id);
        $u->update($r->validate([
            'username'    => "sometimes|string|unique:users,username,{$id}",
            'email'       => "sometimes|email|unique:users,email,{$id}",
            'Role'        => 'sometimes|in:directeurducomlex,gestionnairecfmr',
            'idPersonnel' => "nullable|exists:personnels,idPersonnel|unique:users,idPersonnel,{$id}",
        ]));
        return response()->json($u->fresh('personnel'));
    }
    public function resetPassword(Request $r, $id) {
        $r->validate(['password' => 'required|string|min:8']);
        User::findOrFail($id)->update(['password' => Hash::make($r->password)]);
        return response()->json(['message' => 'Mot de passe réinitialisé.']);
    }
    public function toggleActive($id) {
        $u = User::findOrFail($id);
        $u->update(['active' => !$u->active]);
        return response()->json(['message' => $u->active ? 'Compte activé.' : 'Compte désactivé.', 'active' => $u->active]);
    }
    public function destroy($id) {
        $u = User::findOrFail($id);
        $u->tokens()->delete();
        $u->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
