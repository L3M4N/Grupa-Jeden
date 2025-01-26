<?php

class ORM
{
    protected static $pdo;
    protected static $table;

    public static function setConnection($pdo) {
        self::$pdo = $pdo;
    }

    public static function find($id, $primaryKey = 'id') {
        $stmt = self::$pdo->prepare("SELECT * FROM " . static::$table . " WHERE {$primaryKey} = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function where($column, $value) {
        $stmt = self::$pdo->prepare("SELECT * FROM " . static::$table . " WHERE {$column} = ?");
        $stmt->execute([$value]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create($data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $stmt = self::$pdo->prepare("INSERT INTO " . static::$table . " ({$columns}) VALUES ({$placeholders})");
        $stmt->execute(array_values($data));
        return self::$pdo->lastInsertId();
    }
}