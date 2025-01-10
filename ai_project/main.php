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
            <span class="fav-icon" title="Favourites">
                <i class="bi bi-heart-fill"></i>
            </span>
        </div>
    </div>
    <div id="container">
        <div id="input-container">
            <div class="input-group">
                <label for="indeks">Indeks:</label>
                <input type="text" id="indeks" placeholder="Indeks"/>
            </div>
            <div class="input-group">
                <label for="wykladowca">Wykładowca:</label>
                <input type="text" id="wykladowca" placeholder="Wykładowca"/>
            </div>
            <div class="input-group">
                <label for="grupa">Grupa:</label>
                <input type="text" id="grupa" placeholder="Grupa"/>
            </div>
            <div class="input-group">
                <label for="sala">Sala:</label>
                <input type="text" id="sala" placeholder="Sala"/>
            </div>
            <div class="input-group">
                <label for="przedmiot">Przedmiot:</label>
                <input type="text" id="przedmiot" placeholder="Przedmiot"/>
            </div>
            <div id="button-container">
                <button type="button" title="Wyszukaj">Szukaj</button>
                <button type="button" title="Wyczyść filtry">Wyczyść</button>
                <button type="button" title="Zapisz do ulubionych">
                    <i class="bi bi-floppy-fill"></i>
                </button>
            </div>
        </div>
        <div id="calendar-container">
            <div id="calendar"></div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
