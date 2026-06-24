<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Specialite;
use Illuminate\Http\Request;
class SpecialiteController extends Controller {
    public function index()            { return response()->json(Specialite::withCount(['personnels as personnels_count'])->orderBy('nom_specialite')->get()); }
    public function store(Request $r)  {
        return response()->json(Specialite::create($r->validate(['nom_specialite'=>'required|string|max:255|unique:specialites'])), 201);
    }
    public function show($id)          { return response()->json(Specialite::withCount('personnels')->findOrFail($id)); }
    public function update(Request $r, $id) {
        $s = Specialite::findOrFail($id);
        $s->update($r->validate(['nom_specialite'=>"sometimes|string|max:255|unique:specialites,nom_specialite,{$id},idSpecialite"]));
        return response()->json($s->fresh());
    }
    public function destroy($id)       { Specialite::findOrFail($id)->delete(); return response()->json(['message'=>'Spécialité supprimée.']); }
}
