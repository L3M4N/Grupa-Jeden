"use strict";
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const logoDark = document.querySelector('#logo img');
// Zmiana motywu
const switchTheme = (isDark) => {
    if (isDark) {
        body.classList.add('dark');
        logoDark.src = 'imgs/logo-dark.jpg';
    }
    else {
        body.classList.remove('dark');
        logoDark.src = 'imgs/logo.jpg';
    }
};
themeToggle.addEventListener('change', () => {
    switchTheme(themeToggle.checked);
});
switchTheme(false);
