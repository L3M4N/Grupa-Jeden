<?php

require 'bootstrap.php';
require 'Prowadzacy.php';
require 'Przedmiot.php';
require 'PrzedmiotProwadzacy.php';
require 'Grupa.php';
require 'Sala.php';
require 'Zajecia.php';

function getTeachersFromAPI() {
    $teachers = [];
    $alphabet = range('A', 'Z');

    foreach ($alphabet as $letter) {
        $url = "https://plan.zut.edu.pl/schedule.php?kind=teacher&query={$letter}";
        try {
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            if (is_array($data)) {
                foreach ($data as $entry) {
                    if (isset($entry['item'])) {
                        $teachers[] = $entry['item'];
                    }
                }
            }
        } catch (Exception $e) {
            echo "Błąd przy pobieraniu listy nauczycieli dla litery {$letter}: {$e->getMessage()}\n";
        }
    }

    return array_unique($teachers);
}

function scrapeLessonData($teacher, $start_date, $end_date) {
    $url = "https://plan.zut.edu.pl/schedule_student.php?teacher=" . urlencode($teacher) . "&start={$start_date}&end={$end_date}";
    try {
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if (!$data || !is_array($data)) {
            echo "Błąd: API zwróciło pustą odpowiedź dla nauczyciela {$teacher}.\n";
            return [];
        }

        return $data;
    } catch (Exception $e) {
        echo "Błąd podczas pobierania danych z API dla nauczyciela {$teacher}: " . $e->getMessage() . "\n";
        return [];
    }
}

function processLesson($lesson) {
    $grupa = Grupa::firstOrCreate(['nazwa' => $lesson['group_name'] ?? 'null']);
    $prowadzacy = Prowadzacy::firstOrCreate(['nazwisko_imie_p' => $lesson['worker'] ?? 'null']);
    $przedmiot = Przedmiot::firstOrCreate(['nazwa' => $lesson['subject'] ?? 'null']);
    $sala = Sala::firstOrCreate(['nr_sali' => $lesson['room'] ?? 'null']);

    PrzedmiotProwadzacy::firstOrCreate([
        'id_przedmiotu' => $przedmiot->id_przedmiotu,
        'nr_indeksu_p' => $prowadzacy->nr_indeksu_p,
    ]);

    Zajecia::create([
        'id_przedmiotu' => $przedmiot->id_przedmiotu,
        'forma' => $lesson['lesson_form'] ?? 'Nieznana forma',
        'id_sali' => $sala->id_sali,
        'id_grupy' => $grupa->id_grupy,
        'godzina_od' => substr($lesson['start'], 11, 8),
        'godzina_do' => substr($lesson['end'], 11, 8),
    ]);
}

function main() {
    $teachers = getTeachersFromAPI();
    $start_date = "2024-09-30T00:00:00+02:00";
    $end_date = "2024-10-07T00:00:00+02:00";

    foreach ($teachers as $teacher) {
        $lessons = scrapeLessonData($teacher, $start_date, $end_date);

        foreach ($lessons as $lesson) {
            processLesson($lesson);
        }
    }

    echo "Dane zostały zapisane do bazy.\n";
}

main();
