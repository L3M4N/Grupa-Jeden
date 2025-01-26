<?php


class Sala extends ORM {
    protected static $table = 'sala';
    protected $primaryKey = 'id_sali';
    public $timestamps = false;

    protected $fillable = ['nr_sali'];

    public function zajecia() {
        return $this->hasMany(Zajecia::class, 'id_sali', 'id_sali');
    }
}