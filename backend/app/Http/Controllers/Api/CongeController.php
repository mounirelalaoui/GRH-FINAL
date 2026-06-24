<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Conge;
use Illuminate\Http\Request;

class CongeController extends Controller {
    public function index(Request $request) {
        return response()->json(
            Conge::with('personnel')
                ->when($request->statut,       fn($q,$s) => $q->where('statut', $s))
                ->when($request->idPersonnel,  fn($q,$id)=> $q->where('idPersonnel', $id))
                ->when($request->type_conge,   fn($q,$t) => $q->where('type_conge', $t))
                ->when($request->search,       fn($q,$s) => $q->whereHas('personnel', fn($p) =>
                    $p->where('nom','like',"%$s%")->orWhere('prenom','like',"%$s%")
                ))
                ->latest()
                ->paginate($request->per_page ?? 10)
        );
    }
    public function store(Request $request) {
        $data = $request->validate([
            'idPersonnel'  => 'required|exists:personnels,idPersonnel',
            'type_conge'   => 'required|string|max:255',
            'date_debut'   => 'required|date',
            'date_fin'     => 'required|date|after_or_equal:date_debut',
            'date_demande' => 'required|date',
            'statut'       => 'required|string|max:255',
        ]);
        return response()->json(Conge::create($data)->load('personnel'), 201);
    }
    public function show($id) { return response()->json(Conge::with('personnel')->findOrFail($id)); }
    public function update(Request $request, $id) {
        $conge = Conge::findOrFail($id);
        $conge->update($request->validate([
            'idPersonnel'  => 'sometimes|exists:personnels,idPersonnel',
            'type_conge'   => 'sometimes|string',
            'date_debut'   => 'sometimes|date',
            'date_fin'     => 'sometimes|date|after_or_equal:date_debut',
            'date_demande' => 'sometimes|date',
            'statut'       => 'sometimes|string',
        ]));
        return response()->json($conge->fresh('personnel'));
    }
    public function updateStatut(Request $request, $id) {
        $request->validate(['statut' => 'required|in:en_attente,approuve,refuse']);
        $conge = Conge::findOrFail($id);
        $conge->update(['statut' => $request->statut]);
        return response()->json($conge->fresh('personnel'));
    }
    public function destroy($id) {
        Conge::findOrFail($id)->delete();
        return response()->json(['message' => 'Congé supprimé.']);
    }
}
