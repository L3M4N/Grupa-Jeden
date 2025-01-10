const body = document.body;
const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
const logoDark = document.querySelector('#logo img') as HTMLImageElement;

// Zmiana motywu
const switchTheme = (isDark: boolean) => {
    if (isDark) {
        body.classList.add('dark');
        logoDark.src = 'imgs/logo-dark.jpg';
    } else {
        body.classList.remove('dark');
        logoDark.src = 'imgs/logo.jpg';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('theme');
const isDarkMode = savedTheme === 'dark';

switchTheme(isDarkMode);
themeToggle.checked = isDarkMode;

themeToggle.addEventListener('change', () => {
    switchTheme(themeToggle.checked);
});
