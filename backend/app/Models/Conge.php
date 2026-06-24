<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Conge extends Model {
    protected $primaryKey = 'idConge';
    protected $fillable   = ['date_debut','date_fin','date_demande','type_conge','statut','idPersonnel'];
    protected $casts      = ['date_debut'=>'date','date_fin'=>'date','date_demande'=>'date'];
    public function personnel() { return $this->belongsTo(Personnel::class, 'idPersonnel', 'idPersonnel'); }
}
