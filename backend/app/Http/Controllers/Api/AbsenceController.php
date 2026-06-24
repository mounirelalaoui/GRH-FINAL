<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Absence;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AbsenceController extends Controller {
    public function index(Request $request) {
        return response()->json(
            Absence::with('personnel')
                ->when($request->idPersonnel, fn($q,$id) => $q->where('idPersonnel', $id))
                ->when($request->mois,        fn($q,$m)  => $q->whereMonth('date_absence', $m))
                ->when($request->search,      fn($q,$s)  => $q->whereHas('personnel', fn($p) =>
                    $p->where('nom','like',"%$s%")->orWhere('prenom','like',"%$s%")
                ))
                ->latest('date_absence')
                ->paginate($request->per_page ?? 10)
        );
    }
    public function store(Request $request) {
        $data = $request->validate([
            'idPersonnel'  => 'required|exists:personnels,idPersonnel',
            'date_absence' => 'required|date',
            'motif'        => 'nullable|string|max:255',
        ]);
        return response()->json(Absence::create($data)->load('personnel'), 201);
    }
    public function show($id)    { return response()->json(Absence::with('personnel')->findOrFail($id)); }
    public function update(Request $request, $id) {
        $a = Absence::findOrFail($id);
        $a->update($request->validate([
            'idPersonnel'  => 'sometimes|exists:personnels,idPersonnel',
            'date_absence' => 'sometimes|date',
            'motif'        => 'nullable|string|max:255',
        ]));
        return response()->json($a->fresh('personnel'));
    }
    public function destroy($id) {
        Absence::findOrFail($id)->delete();
        return response()->json(['message' => 'Absence supprimée.']);
    }
    public function stats() {
        $now = Carbon::now();
        return response()->json([
            'total'          => Absence::count(),
            'ce_mois'        => Absence::whereMonth('date_absence', $now->month)->whereYear('date_absence', $now->year)->count(),
            'mois_precedent' => Absence::whereMonth('date_absence', $now->copy()->subMonth()->month)->count(),
        ]);
    }
}
