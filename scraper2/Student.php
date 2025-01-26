<?php

use Illuminate\Database\Eloquent\Model;

class Student extends Model {
    protected $table = 'student';
    protected $primaryKey = 'nr_indeksu_s';
    public $incrementing = false; // Klucz główny nie jest autoinkrementowany
    public $timestamps = false;

    protected $fillable = ['nr_indeksu_s'];

    public function studentGrupy() {
        return $this->hasMany(StudentGrupa::class, 'nr_indeksu_s', 'nr_indeksu_s');
    }

}
