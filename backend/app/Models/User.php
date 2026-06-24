<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable {
    use HasApiTokens;
    protected $fillable  = ['username','email','password','Role','idPersonnel','active'];
    protected $hidden    = ['password','remember_token'];
    protected $casts     = ['password' => 'hashed', 'active' => 'boolean'];
    public function personnel() { return $this->belongsTo(Personnel::class, 'idPersonnel', 'idPersonnel'); }
}
