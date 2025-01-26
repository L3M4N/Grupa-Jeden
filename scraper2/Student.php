<?php

class Student extends ORM {
    protected static $table = 'student';
    protected $primaryKey = 'nr_indeksu_s';
    public $incrementing = false; // Klucz główny nie jest autoinkrementowany
    public $timestamps = false;

    protected $fillable = ['nr_indeksu_s'];

    public function studentGrupy() {
        return $this->hasMany(StudentGrupa::class, 'nr_indeksu_s', 'nr_indeksu_s');
    }

}
