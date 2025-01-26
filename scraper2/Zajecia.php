<?php


use Illuminate\Database\Eloquent\Model;

class Zajecia extends Model {
    protected $table = 'zajecia';
    protected $primaryKey = 'id_zajecia';
    public $timestamps = false;

    protected $fillable = [
        'id_przedmiotu',
        'forma',
        'id_sali',
        'id_grupy',
        'godzina_od',
        'godzina_do',
    ];

    public function przedmiot() {
        return $this->belongsTo(Przedmiot::class, 'id_przedmiotu', 'id_przedmiotu');
    }

    public function grupa() {
        return $this->belongsTo(Grupa::class, 'id_grupy', 'id_grupy');
    }

    public function sala() {
        return $this->belongsTo(Sala::class, 'id_sali', 'id_sali');
    }

}