@echo off
set DB_USER=root
set DB_PASS=password
set DB_NAME=ai_project
set BACKUP_DIR=C:\path\to\backup\directory

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

mysqldump -u %DB_USER% -p%DB_PASS% %DB_NAME% > %BACKUP_DIR%\backup_%date:~10,4%-%date:~7,2%-%date:~4,2%_%time:~0,2%-%time:~3,2%.sql

echo Kopia zapasowa bazy danych została zapisana w katalogu %BACKUP_DIR%.


::Harmonogram Zadań:
::1. Otwórz Harmonogram Zadań w systemie Windows.
::2. Utwórz nowe zadanie:
::3. W sekcji "Wyzwalacze" ustaw harmonogram (np. codziennie o 2:00).
::4. W sekcji "Akcje" wybierz "Uruchom program" i podaj ścieżkę do skryptu backup.bat.