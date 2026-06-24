<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Personnel extends Model {
    protected $primaryKey = 'idPersonnel';
    protected $fillable   = [
        'type_personnel','statut','CIN','nom','prenom','date_naissance',
        'situation_familiale','adresse_actuelle','lieu_naissance','nombre_enfant',
        'telephone','grade','echelon','fonction','contact_nom','contact_telephone',
        'idEtab','idSpecialite','photo_url',
    ];
    protected $casts = ['date_naissance' => 'date'];

    public function etablissement()         { return $this->belongsTo(Etablissement::class, 'idEtab', 'idEtab'); }
    public function specialite()            { return $this->belongsTo(Specialite::class, 'idSpecialite', 'idSpecialite'); }
    public function user()                  { return $this->hasOne(User::class, 'idPersonnel', 'idPersonnel'); }
    public function absences()              { return $this->hasMany(Absence::class, 'idPersonnel', 'idPersonnel'); }
    public function conges()                { return $this->hasMany(Conge::class, 'idPersonnel', 'idPersonnel'); }
    public function diplomes()              { return $this->belongsToMany(Diplome::class, 'obtenir', 'idPersonnel', 'idDiplome'); }
    public function specialitesEnseignees() { return $this->belongsToMany(Specialite::class, 'enseigner', 'idPersonnel', 'idSpecialite'); }
}
