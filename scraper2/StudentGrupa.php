<?php

class StudentGrupa extends ORM {
    protected static $table = 'student_grupa';
    public $timestamps = false;

    protected $fillable = ['nr_indeksu_s', 'id_grupy'];

    public function student() {
        return $this->belongsTo(Student::class, 'nr_indeksu_s', 'nr_indeksu_s');
    }

    public function grupa() {
        return $this->belongsTo(Grupa::class, 'id_grupy', 'id_grupy');
    }

}
