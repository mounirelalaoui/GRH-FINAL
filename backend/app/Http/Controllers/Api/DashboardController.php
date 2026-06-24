<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\{Personnel,Conge,Absence,Etablissement,Specialite,Diplome};
use Carbon\Carbon;

class DashboardController extends Controller {
    public function stats() {
        $now   = Carbon::now();
        $debut = $now->copy()->startOfMonth();
        $fin   = $now->copy()->endOfMonth();
        return response()->json([
            'total_personnels'   => Personnel::count(),
            'formateurs'         => Personnel::where('type_personnel','formateur')->count(),
            'administratifs'     => Personnel::where('type_personnel','administratif')->count(),
            'absences_mois'      => Absence::whereBetween('date_absence',[$debut,$fin])->count(),
            'conges_en_cours'    => Conge::where('statut','approuve')->where('date_fin','>=',$now)->count(),
            'conges_en_attente'  => Conge::where('statut','en_attente')->count(),
            'etablissements'     => Etablissement::count(),
            'specialites'        => Specialite::count(),
            'diplomes'           => Diplome::count(),
        ]);
    }

    public function charts() {
        $year = Carbon::now()->year;
        $absParMois = Absence::selectRaw('MONTH(date_absence) as mois, COUNT(*) as absences')
            ->whereYear('date_absence', $year)->groupBy('mois')->orderBy('mois')->get()->keyBy('mois');
        $months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
        $chartAbs = collect(range(1,12))->map(fn($m) => [
            'mois'     => $months[$m-1],
            'absences' => $absParMois[$m]->absences ?? 0,
        ]);
        $rep = Personnel::selectRaw('type_personnel, COUNT(*) as value')
            ->groupBy('type_personnel')->get()
            ->map(fn($r) => [
                'name'  => $r->type_personnel === 'formateur' ? 'Formateurs' : 'Administratifs',
                'value' => $r->value,
                'color' => $r->type_personnel === 'formateur' ? '#3b82f6' : '#8b5cf6',
            ]);
        return response()->json(['absences_chart' => $chartAbs, 'type_chart' => $rep]);
    }

    public function topAbsences() {
        $now = Carbon::now();
        return response()->json(
            Personnel::withCount(['absences as total' => fn($q) =>
                $q->whereMonth('date_absence',$now->month)->whereYear('date_absence',$now->year)
            ])->with('etablissement')->orderByDesc('total')->limit(5)->get()
              ->map(fn($p) => ['idPersonnel'=>$p->idPersonnel,'nom'=>$p->nom,'prenom'=>$p->prenom,'total'=>$p->total,'etablissement'=>$p->etablissement?->nom])
        );
    }

    public function recent() {
        $conges = Conge::with('personnel')->latest()->limit(3)->get()
            ->map(fn($c) => ['type'=>'conge','label'=>'Demande de congé','nom'=>"{$c->personnel?->prenom} {$c->personnel?->nom}",'statut'=>$c->statut,'date'=>$c->created_at?->toDateString()]);
        $absences = Absence::with('personnel')->latest()->limit(3)->get()
            ->map(fn($a) => ['type'=>'absence','label'=>'Absence enregistrée','nom'=>"{$a->personnel?->prenom} {$a->personnel?->nom}",'statut'=>null,'date'=>$a->date_absence]);
        return response()->json($conges->concat($absences)->sortByDesc('date')->values()->take(8));
    }
}
