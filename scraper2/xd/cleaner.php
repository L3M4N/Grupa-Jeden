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

// Funkcja usuwająca dane starsze niż 6 miesięcy
function deleteOldData($pdo) {
    try {
        // Obliczanie daty sprzed 6 miesięcy
        $dateThreshold = (new DateTime())->modify('-6 months')->format('Y-m-d');

        // Usuń dane starsze niż 6 miesięcy z tabeli `zajecia`
        $sql = "DELETE FROM zajecia WHERE godzina_od < ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$dateThreshold]);

        echo "Dane starsze niż 6 miesięcy zostały usunięte.\n";
    } catch (PDOException $e) {
        echo "Błąd podczas usuwania danych: " . $e->getMessage() . "\n";
    }
}

function main() {
    global $config;

    $pdo = getDatabaseConnection($config);
    deleteOldData($pdo);
}

main();
