<?php


use Illuminate\Database\Eloquent\Model;

class Prowadzacy extends Model {
    protected $table = 'prowadzacy';
    protected $primaryKey = 'nr_indeksu_p';
    public $timestamps = false;

    protected $fillable = ['nazwisko_imie_p'];

    public function przedmioty() {
        return $this->hasMany(PrzedmiotProwadzacy::class, 'nr_indeksu_p', 'nr_indeksu_p');
    }
}