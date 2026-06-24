<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Diplome;
use Illuminate\Http\Request;
class DiplomeController extends Controller {
    public function index()            { return response()->json(Diplome::withCount(['personnels as personnels_count'])->orderBy('nom_diplome')->get()); }
    public function store(Request $r)  {
        return response()->json(Diplome::create($r->validate(['nom_diplome'=>'required|string|max:255|unique:diplomes'])), 201);
    }
    public function show($id)          { return response()->json(Diplome::withCount('personnels')->findOrFail($id)); }
    public function update(Request $r, $id) {
        $d = Diplome::findOrFail($id);
        $d->update($r->validate(['nom_diplome'=>"sometimes|string|max:255|unique:diplomes,nom_diplome,{$id},idDiplome"]));
        return response()->json($d->fresh());
    }
    public function destroy($id)       { Diplome::findOrFail($id)->delete(); return response()->json(['message'=>'Diplôme supprimé.']); }
}
