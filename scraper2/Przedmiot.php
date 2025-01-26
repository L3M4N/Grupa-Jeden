<?php


use Illuminate\Database\Eloquent\Model;

class Przedmiot extends Model {
    protected $table = 'przedmiot';
    protected $primaryKey = 'id_przedmiotu';
    public $timestamps = false;

    protected $fillable = ['nazwa'];

    public function zajecia() {
        return $this->hasMany(Zajecia::class, 'id_przedmiotu', 'id_przedmiotu');
    }

    public function przedmiotProwadzacy() {
        return $this->hasMany(PrzedmiotProwadzacy::class, 'id_przedmiotu', 'id_przedmiotu');
    }

}