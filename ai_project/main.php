<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan ZUT</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="icon" href="imgs/page-logo.png">
</head>
<body>
<div id="header-container">
    <div id="logo">
        <img src="imgs/logo-zut.svg" alt="Logo ZUT">
    </div>
    <div id="title">Plan ZUT</div>
    <div id="theme-switcher">
            <span class="theme-icon" title="Light Mode">
                <i class="bi bi-brightness-high-fill"></i>
            </span>
        <label class="switch">
            <input type="checkbox" id="theme-toggle">
            <span class="slider round"></span>
        </label>
        <span class="theme-icon" title="Dark Mode">
                <i class="bi bi-moon-fill"></i>
            </span>
    </div>
    <div id="save-fav">
        <span class="fav-icon" id="fav-display" title="Favourites">
            <i class="bi bi-heart-fill"></i>
        </span>
        <div id="favourites-container">
            <h3>Ulubione Filtry</h3>
            <ul id="favourites-list"></ul>
        </div>
    </div>
</div>
<div id="container">
    <div id="input-container">
        <div class="input-group">
            <label for="indeks">Indeks:</label>
            <input type="text" name="indeks" placeholder="Indeks">
        </div>
        <div class="input-group">
            <label for="wykladowca">Wykładowca:</label>
            <input type="text" name="wykladowca" placeholder="Wykładowca"/>
        </div>
        <div class="input-group">
            <label for="grupa">Grupa:</label>
            <input type="text" name="grupa" placeholder="Grupa"/>
        </div>
        <div class="input-group">
            <label for="sala">Sala:</label>
            <input type="text" name="sala" placeholder="Sala">
        </div>
        <div class="input-group">
            <label for="przedmiot">Przedmiot:</label>
            <input type="text" name="przedmiot" placeholder="Przedmiot"/>
        </div>
        <?php
            $indeks = isset($_GET['indeks']) ? htmlspecialchars($_GET['indeks']) : '';
            $wykladowca = isset($_GET['wykladowca']) ? htmlspecialchars($_GET['wykladowca']) : '';
            $grupa = isset($_GET['grupa']) ? htmlspecialchars($_GET['grupa']) : '';
            $sala = isset($_GET['sala']) ? htmlspecialchars($_GET['sala']) : '';
            $przedmiot = isset($_GET['przedmiot']) ? htmlspecialchars($_GET['przedmiot']) : '';
        ?>
        <div id="button-container">
            <button id="search-button">Szukaj</button>
            <button id="clear-button" title="Wyczyść filtry">Wyczyść</button>
            <button type="button" id="save-to-favourites" title="Zapisz do ulubionych">
                <i class="bi bi-floppy-fill"></i>
            </button>
        </div>
        <div id="url-container">
            <button id="generate-url">Generuj URL</button>
            <input type="text" id="generated-url" readonly placeholder="Wygenerowany URL"/>
            <button id="copy-url" title="Skopiuj URL do schowka"><i class="bi bi-link"></i></button>
        </div>
    </div>
    <div id="calendar-container">
        <div class="given-range-container">
            <div id="date">
                <label for="start-date">Od:</label>
                <input type="date" id="start-date">
                <label for="end-date">Do:</label>
                <input type="date" id="end-date">
                <button id="apply-dates" class="given-btn2">Zatwierdź</button>
            </div>
        </div>
        <div id="calendar"></div>
        <div class="calendar-legend">
            <div class="legend-item">
                <span class="legend-color" style="background-color: #FF5733;"></span>
                <span class="legend-label">Wykład</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #33FF57;"></span>
                <span class="legend-label">Audytoria</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #3357FF;"></span>
                <span class="legend-label">Laboratorium</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #F3FF33;"></span>
                <span class="legend-label">Lektorat</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #FF33A8;"></span>
                <span class="legend-label">Projekt</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #0000FF;"></span>
                <span class="legend-label">Egzamin</span>
            </div>
        </div>
    </div>
    <div id="table-container"></div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('input[name="indeks"]').value = "<?php echo $indeks; ?>";
        document.querySelector('input[name="wykladowca"]').value = "<?php echo $wykladowca; ?>";
        document.querySelector('input[name="grupa"]').value = "<?php echo $grupa; ?>";
        document.querySelector('input[name="sala"]').value = "<?php echo $sala; ?>";
        document.querySelector('input[name="przedmiot"]').value = "<?php echo $przedmiot; ?>";
    });
</script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
<script src="script.js"></script>
</body>
</html>