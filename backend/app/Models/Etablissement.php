<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Etablissement extends Model {
    protected $primaryKey = 'idEtab';
    protected $fillable   = ['nom', 'ville'];
    public function personnels() { return $this->hasMany(Personnel::class, 'idEtab', 'idEtab'); }
}
