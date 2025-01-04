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
            <img src="imgs/logo.jpg" alt="Logo">
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
            <input type="text" placeholder="Indeks"/>
            <input type="text" placeholder="Wykładowca"/>
            <input type="text" placeholder="Grupa"/>
            <input type="text" placeholder="Sala"/>
            <input type="text" placeholder="Przedmiot"/>
            <input type="text" placeholder="Budynek"/>
        </div>
        <div id="calendar-container">
            <div id="calendar">

            </div>
        </div>
    </div>
<script src="src.js"></script>
</body>
</html>
