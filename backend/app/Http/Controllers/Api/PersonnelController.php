<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonnelController extends Controller {
    public function index(Request $request) {
        $q = Personnel::with(['etablissement','specialite'])
            ->when($request->search,        fn($q,$s) => $q->where('nom','like',"%$s%")->orWhere('prenom','like',"%$s%")->orWhere('CIN','like',"%$s%"))
            ->when($request->type_personnel, fn($q,$t) => $q->where('type_personnel',$t))
            ->when($request->statut,        fn($q,$s) => $q->where('statut',$s))
            ->when($request->idEtab,        fn($q,$id)=> $q->where('idEtab',$id))
            ->when($request->idSpecialite,  fn($q,$id)=> $q->where('idSpecialite',$id))
            ->orderBy($request->sort ?? 'nom', $request->direction ?? 'asc');
        return response()->json($q->paginate($request->per_page ?? 10));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'type_personnel'      => 'required|in:formateur,administratif',
            'statut'              => 'required|in:permanent,vacataire',
            'CIN'                 => 'required|string|unique:personnels,CIN',
            'nom'                 => 'required|string|max:255',
            'prenom'              => 'required|string|max:255',
            'date_naissance'      => 'nullable|date',
            'situation_familiale' => 'nullable|string',
            'adresse_actuelle'    => 'nullable|string',
            'lieu_naissance'      => 'nullable|string',
            'nombre_enfant'       => 'nullable|string',
            'telephone'           => 'nullable|string|max:20',
            'grade'               => 'nullable|string',
            'echelon'             => 'nullable|string',
            'fonction'            => 'nullable|string',
            'contact_nom'         => 'nullable|string',
            'contact_telephone'   => 'nullable|string|max:20',
            'idEtab'              => 'required|exists:etablissements,idEtab',
            'idSpecialite'        => 'nullable|exists:specialites,idSpecialite',
            'diplomes'            => 'nullable|array',
            'diplomes.*'          => 'exists:diplomes,idDiplome',
            'specialites_ens'     => 'nullable|array',
            'specialites_ens.*'   => 'exists:specialites,idSpecialite',
        ]);
        if ($request->hasFile('photo')) {
            $data['photo_url'] = $request->file('photo')->store('photos/personnels','public');
        }
        $personnel = Personnel::create($data);
        if (isset($data['diplomes']))        $personnel->diplomes()->sync($data['diplomes']);
        if (isset($data['specialites_ens'])) $personnel->specialitesEnseignees()->sync($data['specialites_ens']);
        return response()->json($personnel->load(['etablissement','specialite','diplomes']), 201);
    }

    public function show($id) {
        return response()->json(
            Personnel::with(['etablissement','specialite','diplomes','specialitesEnseignees'])->findOrFail($id)
        );
    }

    public function update(Request $request, $id) {
        $personnel = Personnel::findOrFail($id);
        $data = $request->validate([
            'type_personnel'      => 'sometimes|in:formateur,administratif',
            'statut'              => 'sometimes|in:permanent,vacataire',
            'CIN'                 => "sometimes|string|unique:personnels,CIN,{$id},idPersonnel",
            'nom'                 => 'sometimes|string|max:255',
            'prenom'              => 'sometimes|string|max:255',
            'date_naissance'      => 'nullable|date',
            'situation_familiale' => 'nullable|string',
            'adresse_actuelle'    => 'nullable|string',
            'lieu_naissance'      => 'nullable|string',
            'nombre_enfant'       => 'nullable|string',
            'telephone'           => 'nullable|string|max:20',
            'grade'               => 'nullable|string',
            'echelon'             => 'nullable|string',
            'fonction'            => 'nullable|string',
            'contact_nom'         => 'nullable|string',
            'contact_telephone'   => 'nullable|string|max:20',
            'idEtab'              => 'sometimes|exists:etablissements,idEtab',
            'idSpecialite'        => 'nullable|exists:specialites,idSpecialite',
            'diplomes'            => 'nullable|array',
            'diplomes.*'          => 'exists:diplomes,idDiplome',
            'specialites_ens'     => 'nullable|array',
            'specialites_ens.*'   => 'exists:specialites,idSpecialite',
        ]);
        if ($request->hasFile('photo')) {
            if ($personnel->photo_url) Storage::disk('public')->delete($personnel->photo_url);
            $data['photo_url'] = $request->file('photo')->store('photos/personnels','public');
        }
        $personnel->update($data);
        if (array_key_exists('diplomes',        $data)) $personnel->diplomes()->sync($data['diplomes'] ?? []);
        if (array_key_exists('specialites_ens', $data)) $personnel->specialitesEnseignees()->sync($data['specialites_ens'] ?? []);
        return response()->json($personnel->fresh(['etablissement','specialite','diplomes']));
    }

    public function destroy($id) {
        $p = Personnel::findOrFail($id);
        if ($p->photo_url) Storage::disk('public')->delete($p->photo_url);
        $p->delete();
        return response()->json(['message' => 'Personnel supprimé.']);
    }

    public function conges($id)       { return response()->json(Personnel::findOrFail($id)->conges()->with('personnel')->latest()->paginate(10)); }
    public function absences($id)     { return response()->json(Personnel::findOrFail($id)->absences()->latest()->paginate(10)); }
    public function diplomes_($id)    { return response()->json(Personnel::findOrFail($id)->diplomes); }
    public function specialites_($id) { return response()->json(Personnel::findOrFail($id)->specialitesEnseignees); }
}
