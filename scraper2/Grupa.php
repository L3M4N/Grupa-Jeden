<?php


class Grupa extends ORM {
    protected static $table = 'grupa';
    protected $primaryKey = 'id_grupy';
    public $timestamps = false;

    protected $fillable = ['nazwa'];

    public function zajecia() {
        return $this->hasMany(Zajecia::class, 'id_grupy', 'id_grupy');
    }

    public function studentGrupy() {
        return $this->hasMany(StudentGrupa::class, 'id_grupy', 'id_grupy');
    }

}