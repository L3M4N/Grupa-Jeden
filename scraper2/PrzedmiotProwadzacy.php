<?php

class PrzedmiotProwadzacy extends ORM {
    protected static $table = 'przedmiot_prowadzacy';
    public $timestamps = false;

    protected $fillable = ['id_przedmiotu', 'nr_indeksu_p'];
}