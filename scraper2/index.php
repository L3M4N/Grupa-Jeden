<?php

require 'ORM.php';
require 'Prowadzacy.php';
require 'Przedmiot.php';
require 'PrzedmiotProwadzacy.php';
require 'Grupa.php';
require 'Sala.php';
require 'Zajecia.php';
require 'Student.php';
require 'StudentGrupa.php';

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
    $grupa = Grupa::create(['nazwa' => $lesson['group_name'] ?? 'null']);
    $prowadzacy = Prowadzacy::create(['nazwisko_imie_p' => $lesson['worker'] ?? 'null']);
    $przedmiot = Przedmiot::create(['nazwa' => $lesson['subject'] ?? 'null']);
    $sala = Sala::create(['nr_sali' => $lesson['room'] ?? 'null']);

    PrzedmiotProwadzacy::create([
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

function scrapeStudentData($studentIndex, $start_date, $end_date) {
    $url = "https://plan.zut.edu.pl/schedule_student.php?number={$studentIndex}&start={$start_date}&end={$end_date}";

    try {
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if (!$data || !is_array($data)) {
            echo "Błąd: API zwróciło pustą odpowiedź dla numeru indeksu {$studentIndex}.\n";
            return [];
        }

        return $data;
    } catch (Exception $e) {
        echo "Błąd podczas pobierania danych z API dla numeru indeksu {$studentIndex}: " . $e->getMessage() . "\n";
        return [];
    }
}

function processStudentData($studentIndex, $data) {
    // Sprawdzenie istnienia studenta
    $existingStudent = Student::where('nr_indeksu_s', $studentIndex);
    if (empty($existingStudent)) {
        // Dodanie nowego studenta
        Student::create(['nr_indeksu_s' => $studentIndex]);
        echo "Dodano nowego studenta o numerze indeksu: {$studentIndex}\n";
    }

    // Iteracja po lekcjach
    foreach ($data as $lesson) {
        if (isset($lesson['group_name'])) {
            // Znajdź grupę lub dodaj nową
            $existingGroup = Grupa::where('nazwa', $lesson['group_name']);
            $groupId = null;

            if (empty($existingGroup)) {
                // Tworzenie nowej grupy
                $groupId = Grupa::create(['nazwa' => $lesson['group_name']]);
                echo "Dodano nową grupę: {$lesson['group_name']}\n";
            } else {
                $groupId = $existingGroup[0]['id_grupy']; // Pobranie ID grupy
            }

            // Sprawdzenie powiązania student -> grupa
            $existingRelation = StudentGrupa::where('nr_indeksu_s', $studentIndex);
            $relationExists = false;

            foreach ($existingRelation as $relation) {
                if ($relation['id_grupy'] == $groupId) {
                    $relationExists = true;
                    break;
                }
            }

            if (!$relationExists) {
                // Dodanie powiązania
                StudentGrupa::create([
                    'nr_indeksu_s' => $studentIndex,
                    'id_grupy' => $groupId,
                ]);
            }
        }
    }

    echo "Dane dla studenta o numerze indeksu {$studentIndex} zostały zapisane.\n";
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=ai_project', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    ORM::setConnection($pdo);
} catch (PDOException $e) {
    die("Nie można połączyć się z bazą danych: " . $e->getMessage());
}

function main() {
    global $pdo;

    $start_date = "2025-01-01T00:00:00+02:00";
    $end_date = "2025-01-31T00:00:00+02:00";

    $teachers = getTeachersFromAPI();

//    foreach ($teachers as $teacher) {
//        $lessons = scrapeLessonData($teacher, $start_date, $end_date);
//
//        foreach ($lessons as $lesson) {
//            processLesson($lesson);
//        }
//    }

    for ($studentIndex = 51000; $studentIndex <= 54000; $studentIndex++) {
        echo "Pobieranie danych dla studenta o numerze indeksu: {$studentIndex}\n";

        $studentData = scrapeStudentData($studentIndex, $start_date, $end_date);

        if (!empty($studentData)) {
            processStudentData($studentIndex, $studentData);
        } else {
            echo "Brak danych dla studenta o numerze indeksu {$studentIndex}.\n";
        }
    }
    echo "Dane dla wszystkich studentów w zakresie indeksów zostały przetworzone.\n";
    echo "Dane zostały zapisane do bazy.\n";
}

main();
