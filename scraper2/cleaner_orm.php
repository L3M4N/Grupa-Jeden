<?php

require 'ORM.php';
require 'Zajecia.php';
require 'Przedmiot.php';
require 'Prowadzacy.php';
require 'Grupa.php';
require 'Sala.php';
require 'PrzedmiotProwadzacy.php';

function deleteOldData() {
    try {
        $dateThreshold = (new DateTime())->modify('-6 months')->format('Y-m-d H:i:s');
        echo "Usuwanie danych starszych niż: {$dateThreshold}\n";

        $deletedClasses = Zajecia::where('godzina_od', '<', $dateThreshold);

        foreach ($deletedClasses as $class) {
            Zajecia::delete($class['id_zajecia']);
        }
        echo "Usunięto stare zajęcia.\n";

    } catch (Exception $e) {
        echo "Błąd podczas usuwania danych: " . $e->getMessage() . "\n";
    }
}


// Wywołanie funkcji
deleteOldData();
