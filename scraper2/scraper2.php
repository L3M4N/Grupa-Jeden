<?php

$config = [
    'host' => 'localhost',
    'dbname' => 'ai_project',
    'user' => 'root', // Zastąp "username" swoim użytkownikiem
    'password' => '', // Zastąp "password" swoim hasłem
];

// Połączenie z bazą danych
function getDatabaseConnection($config) {
    try {
        return new PDO(
            "mysql:host={$config['host']};dbname={$config['dbname']}",
            $config['user'],
            $config['password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

// Wyszukiwanie nauczycieli z API
function getTeachersFromAPI() {
    $teachers = [];
    $alphabet = range('A', 'Z');

    foreach ($alphabet as $letter) {
        $url = "https://plan.zut.edu.pl/schedule.php?kind=teacher&query={$letter}";
        try {
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            // Jeśli dane są tablicą obiektów, wyciągnij wartość z klucza 'item'
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

    return array_unique($teachers); // Usunięcie duplikatów
}

// Scrape'owanie danych dla nauczyciela
function scrapeTeacherSchedule($teacher, $start_date, $end_date) {
    $url = "https://plan.zut.edu.pl/schedule_student.php?teacher=" . urlencode($teacher) . "&start={$start_date}&end={$end_date}";
    try {
        $response = file_get_contents($url);
        return json_decode($response, true);
    } catch (Exception $e) {
        echo "Błąd podczas pobierania danych dla nauczyciela {$teacher}: {$e->getMessage()}\n";
        return null;
    }
}

// Zapisywanie danych do bazy danych
function saveToDatabase($data, $pdo)
{
    foreach ($data as $lesson) {
        if (empty($lesson)) continue;

        // Wyszukiwanie lub dodanie przedmiotu
        $stmt = $pdo->prepare("INSERT INTO przedmiot (nazwa) VALUES (:nazwa) ON DUPLICATE KEY UPDATE id_przedmiotu = LAST_INSERT_ID(id_przedmiotu)");
        $stmt->execute([':nazwa' => $lesson['subject']]);
        $id_przedmiotu = $pdo->lastInsertId();

        // Wyodrębnij nazwę budynku z nazwy sali
        $building_name = null;
        if (!empty($lesson['room'])) {
            $building_name = explode(' ', $lesson['room'])[0]; // Przykładowe wyodrębnienie budynku z nazwy sali
        }

// Wyszukiwanie lub dodanie budynku
        $id_budynku = null;
        if ($building_name) {
            $stmt = $pdo->prepare("INSERT INTO budynek (nazwa) VALUES (:nazwa) ON DUPLICATE KEY UPDATE id_budynku = LAST_INSERT_ID(id_budynku)");
            $stmt->execute([':nazwa' => $building_name]);
            $id_budynku = $pdo->lastInsertId();
        }

// Dodanie sali
        if (!empty($lesson['room'])) {
            $stmt = $pdo->prepare("INSERT INTO sala (nr_sali, id_budynku) VALUES (:nr_sali, :id_budynku) ON DUPLICATE KEY UPDATE id_sali = LAST_INSERT_ID(id_sali)");
            $stmt->execute([':nr_sali' => $lesson['room'], ':id_budynku' => $id_budynku]);
            $id_sali = $pdo->lastInsertId();
        }
        echo "Room: {$lesson['room']}, Building: {$building_name}\n";


        // Wyszukiwanie lub dodanie grupy
        if (!empty($lesson['group_name'])) {
            $stmt = $pdo->prepare("INSERT INTO grupa (nazwa) VALUES (:nazwa) ON DUPLICATE KEY UPDATE id_grupy = LAST_INSERT_ID(id_grupy)");
            $stmt->execute([':nazwa' => $lesson['group_name']]);
            $id_grupy = $pdo->lastInsertId();
        } else {
            $id_grupy = null;
        }

        // Dodanie zajęć
        // Dodanie zajęć
        if (empty($id_grupy)) {
            echo "Pomijanie zajęć bez przypisanej grupy\n";
            continue; // Pomiń ten rekord, jeśli `id_grupy` jest wymagane
        }

        $stmt = $pdo->prepare("
    INSERT INTO zajecia (id_przedmiotu, forma, id_sali, id_grupy, godzina_od, godzina_do)
    VALUES (:id_przedmiotu, :forma, :id_sali, :id_grupy, :godzina_od, :godzina_do)
");
        $stmt->execute([
            ':id_przedmiotu' => $id_przedmiotu,
            ':forma' => $lesson['lesson_form'] ?? 'nieznane',
            ':id_sali' => $id_sali ?? null,
            ':id_grupy' => $id_grupy,
            ':godzina_od' => $lesson['start'],
            ':godzina_do' => $lesson['end'],
        ]);
    }
}


// Główna funkcja
function main($config) {
    $pdo = getDatabaseConnection($config);

    // Pobranie listy nauczycieli z API
    echo "Pobieranie listy nauczycieli...\n";
    $teachers = getTeachersFromAPI();
    echo "Znaleziono nauczycieli: " . count($teachers) . "\n";
//    print_r($teachers);

    file_put_contents('teachers.json', json_encode($teachers, JSON_PRETTY_PRINT));
    echo "Lista nauczycieli została zapisana w pliku teachers.json\n";


    $start_date = "2024-09-01T00:00:00+02:00";
    $end_date = "2025-02-28T23:59:59+02:00";

    // Scrape'owanie danych dla każdego nauczyciela
    foreach ($teachers as $teacher) {
        echo "Pobieranie danych dla nauczyciela: {$teacher}\n";
        $schedule = scrapeTeacherSchedule($teacher, $start_date, $end_date);
        if ($schedule) {
            saveToDatabase($schedule, $pdo);
        } else {
            echo "Brak danych dla nauczyciela: {$teacher}\n";
        }
        sleep(2); // Pauza, aby uniknąć przekroczenia limitów API
    }

    echo "Zakończono scrape'owanie danych.\n";
}

// Uruchomienie skryptu
main($config);
