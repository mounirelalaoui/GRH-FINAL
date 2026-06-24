<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Absence extends Model {
    protected $primaryKey = 'idAbsence';
    protected $fillable   = ['date_absence','motif','idPersonnel'];
    protected $casts      = ['date_absence' => 'date'];
    public function personnel() { return $this->belongsTo(Personnel::class, 'idPersonnel', 'idPersonnel'); }
}
