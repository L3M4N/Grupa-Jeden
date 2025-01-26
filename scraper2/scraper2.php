<?php

$config = [
    'host' => 'localhost',
    'dbname' => 'ai_project',
    'user' => 'root',
    'password' => '',
];

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

// Pobieranie listy nauczycieli z API
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

    return array_unique($teachers); // Usunięcie duplikatów
}

function saveTeachersToJson($teachers, $filename) {
    try {
        $jsonData = json_encode($teachers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($filename, $jsonData);
        echo "Lista nauczycieli została zapisana do pliku: {$filename}\n";
    } catch (Exception $e) {
        echo "Błąd podczas zapisywania danych do pliku JSON: " . $e->getMessage() . "\n";
    }
}


// Pobieranie danych z API dla nauczyciela
function scrapeLessonData($teacher, $start_date, $end_date) {
    $url = "https://plan.zut.edu.pl/schedule_student.php?teacher=" . urlencode($teacher) . "&start={$start_date}&end={$end_date}";
    try {
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if (!$data || !is_array($data)) {
            echo "Błąd: API zwróciło pustą lub niepoprawną odpowiedź dla nauczyciela {$teacher}.\n";
            return [];
        }

        return $data;
    } catch (Exception $e) {
        echo "Błąd podczas pobierania danych z API dla nauczyciela {$teacher}: " . $e->getMessage() . "\n";
        return [];
    }
}

// Zapis grupy
function saveGroupIfNotExists($pdo, $groupName) {
    // Ustaw wartość domyślną dla grupy, jeśli brak nazwy
    $groupName = $groupName ?: 'Nieznana grupa';

    $sqlCheck = "SELECT id_grupy FROM grupa WHERE nazwa = ?";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([$groupName]);
    $id = $stmtCheck->fetchColumn();

    if ($id) {
        return $id;
    }

    $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (?)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->execute([$groupName]);

    return $pdo->lastInsertId();
}


// Zapis prowadzącego
function saveTeacherIfNotExists($pdo, $worker) {
    $workerParts = explode(' ', $worker);
    $lastName = $workerParts[0] ?? 'Nieznane nazwisko';
    $firstName = $workerParts[1] ?? 'Nieznane imię';

    $formattedWorker = "{$lastName} {$firstName}";

    $sqlCheck = "SELECT nr_indeksu_p FROM prowadzacy WHERE nazwisko_imie_p = ?";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([$formattedWorker]);
    $id = $stmtCheck->fetchColumn();

    if ($id) {
        return $id;
    }

    $sqlInsert = "INSERT INTO prowadzacy (nazwisko_imie_p) VALUES (?)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->execute([$formattedWorker]);

    return $pdo->lastInsertId();
}

// Zapis przedmiotu
function saveSubjectIfNotExists($pdo, $subjectName) {
    $sqlCheck = "SELECT id_przedmiotu FROM przedmiot WHERE nazwa = ?";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([$subjectName]);
    $id = $stmtCheck->fetchColumn();

    if ($id) {
        return $id;
    }

    $sqlInsert = "INSERT INTO przedmiot (nazwa) VALUES (?)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->execute([$subjectName]);

    return $pdo->lastInsertId();
}

// Przypisanie przedmiotu do prowadzącego
function saveSubjectTeacherRelation($pdo, $subjectId, $teacherId) {
    $sqlCheck = "SELECT 1 FROM przedmiot_prowadzacy WHERE id_przedmiotu = ? AND nr_indeksu_p = ?";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([$subjectId, $teacherId]);

    if ($stmtCheck->fetchColumn()) {
        return;
    }

    $sqlInsert = "INSERT INTO przedmiot_prowadzacy (id_przedmiotu, nr_indeksu_p) VALUES (?, ?)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->execute([$subjectId, $teacherId]);
}

// Zapis sali
function saveRoomIfNotExists($pdo, $roomName) {
    $sqlCheck = "SELECT id_sali FROM sala WHERE nr_sali = ?";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([$roomName]);
    $id = $stmtCheck->fetchColumn();

    if ($id) {
        return $id;
    }

    $sqlInsert = "INSERT INTO sala (nr_sali) VALUES (?)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->execute([$roomName]);

    return $pdo->lastInsertId();
}

// Zapis zajęć
function saveLesson($pdo, $data) {
    $sql = "INSERT INTO zajecia (id_przedmiotu, forma, id_sali, id_grupy, godzina_od, godzina_do) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['id_przedmiotu'],
        $data['forma'],
        $data['id_sali'],
        $data['id_grupy'],
        substr($data['godzina_od'], 11, 8),
        substr($data['godzina_do'], 11, 8)
    ]);
}

// Główna funkcja zapisująca lekcję
function processLesson($pdo, $lesson) {
    // Debugowanie danych wejściowych
    echo "Przetwarzanie lekcji:\n";

    // Walidacja i uzupełnianie danych
    $lesson['group_name'] = $lesson['group_name'] ?? 'null';
    $lesson['worker'] = $lesson['worker'] ?? 'null';
    $lesson['subject'] = $lesson['subject'] ?? 'null';
    $lesson['room'] = $lesson['room'] ?? 'null';
    $lesson['lesson_form'] = $lesson['lesson_form'] ?? 'null';
    $lesson['start'] = $lesson['start'] ?? 'null';
    $lesson['end'] = $lesson['end'] ?? 'null';

    try {
        $groupId = saveGroupIfNotExists($pdo, $lesson['group_name']);
        $teacherId = saveTeacherIfNotExists($pdo, $lesson['worker']);
        $subjectId = saveSubjectIfNotExists($pdo, $lesson['subject']);
        saveSubjectTeacherRelation($pdo, $subjectId, $teacherId);
        $roomId = saveRoomIfNotExists($pdo, $lesson['room']);

        saveLesson($pdo, [
            'id_przedmiotu' => $subjectId,
            'forma' => $lesson['lesson_form'],
            'id_sali' => $roomId,
            'id_grupy' => $groupId,
            'godzina_od' => $lesson['start'],
            'godzina_do' => $lesson['end']
        ]);
    } catch (PDOException $e) {
        echo "Błąd przy zapisie danych:\n";
        print_r($lesson);
        echo "Błąd SQL: " . $e->getMessage() . "\n";
    }
}


// Główna funkcja
function main() {
    global $config;

    $pdo = getDatabaseConnection($config);

    $teachers = getTeachersFromAPI();

    $start_date = "2025-01-01T00:00:00+02:00";
    $end_date = "2025-01-31T00:00:00+02:00";

    foreach ($teachers as $teacher) {
        print_r($teacher."\n");
        $lessons = scrapeLessonData($teacher, $start_date, $end_date);
        foreach ($lessons as $lesson) {
            processLesson($pdo, $lesson);
        }
    }

    echo "Dane dla wszystkich nauczycieli zostały zapisane do bazy danych.\n";
}

main();
