<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller {
    public function login(Request $request) {
        $request->validate(['email'=>'required|email','password'=>'required|string']);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Identifiants incorrects.']]);
        }
        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user'  => [
                'id'          => $user->id,
                'username'    => $user->username,
                'email'       => $user->email,
                'Role'        => $user->Role,
                'idPersonnel' => $user->idPersonnel,
            ]
        ]);
    }
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
    public function me(Request $request) {
        return response()->json($request->user()->load('personnel'));
    }
    public function changePassword(Request $request) {
        $request->validate(['current_password'=>'required','password'=>'required|min:8']);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Mot de passe modifié.']);
    }
}
