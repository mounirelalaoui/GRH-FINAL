<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use Illuminate\Http\Request;
class EtablissementController extends Controller {
    public function index()            { return response()->json(Etablissement::withCount('personnels')->orderBy('nom')->get()); }
    public function store(Request $r)  {
        return response()->json(Etablissement::create($r->validate(['nom'=>'required|string|max:255','ville'=>'required|string|max:255'])), 201);
    }
    public function show($id)          { return response()->json(Etablissement::withCount('personnels')->findOrFail($id)); }
    public function update(Request $r, $id) {
        $e = Etablissement::findOrFail($id);
        $e->update($r->validate(['nom'=>'sometimes|string|max:255','ville'=>'sometimes|string|max:255']));
        return response()->json($e->fresh());
    }
    public function destroy($id)       { Etablissement::findOrFail($id)->delete(); return response()->json(['message'=>'Établissement supprimé.']); }
}
