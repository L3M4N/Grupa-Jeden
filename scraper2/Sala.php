<?php


use Illuminate\Database\Eloquent\Model;

class Sala extends Model {
    protected $table = 'sala';
    protected $primaryKey = 'id_sali';
    public $timestamps = false;

    protected $fillable = ['nr_sali'];

    public function zajecia() {
        return $this->hasMany(Zajecia::class, 'id_sali', 'id_sali');
    }
}