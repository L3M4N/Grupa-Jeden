<?php

require 'bootstrap.php';
require 'Zajecia.php';
require 'Przedmiot.php';
require 'Prowadzacy.php';
require 'Grupa.php';
require 'Sala.php';
require 'PrzedmiotProwadzacy.php';

function deleteOldData() {
    try {
        // Oblicz datę sprzed 6 miesięcy
        $dateThreshold = (new DateTime())->modify('-6 months')->format('Y-m-d');

        // Usuń zajęcia starsze niż 6 miesięcy
        $deleted = Zajecia::where('godzina_od', '<', $dateThreshold)->delete();

        echo "Usunięto {$deleted} zajęć starszych niż 6 miesięcy.\n";

        // Usuń osierocone dane
        deleteOrphanedData();

    } catch (Exception $e) {
        echo "Błąd podczas usuwania danych: " . $e->getMessage() . "\n";
    }
}

function deleteOrphanedData() {
    try {
        // Usuń osierocone przedmioty
        Przedmiot::doesntHave('zajecia')->delete();

        // Usuń osieroconych prowadzących
        Prowadzacy::doesntHave('przedmiotProwadzacy')->delete();

        // Usuń osierocone grupy
        Grupa::doesntHave('zajecia')->delete();

        // Usuń osierocone sale
        Sala::doesntHave('zajecia')->delete();

        echo "Osierocone dane zostały usunięte.\n";

    } catch (Exception $e) {
        echo "Błąd podczas usuwania osieroconych danych: " . $e->getMessage() . "\n";
    }
}

// Wywołanie funkcji
deleteOldData();
