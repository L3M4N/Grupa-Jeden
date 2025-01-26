<?php


use Illuminate\Database\Eloquent\Model;

class PrzedmiotProwadzacy extends Model {
    protected $table = 'przedmiot_prowadzacy';
    public $timestamps = false;

    protected $fillable = ['id_przedmiotu', 'nr_indeksu_p'];
}