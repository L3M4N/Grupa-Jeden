"use strict";
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const logoDark = document.getElementById('logo');
// Zmiana motywu
const switchTheme = (isDark) => {
    if (isDark) {
        body.classList.add('dark');
        logoDark.style.backgroundColor = 'gray';
    }
    else {
        body.classList.remove('dark');
        logoDark.style.backgroundColor = 'white';
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

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridDay', // Default to weekly view
        headerToolbar: {
            left: 'prev,next today', // Navigation buttons
            center: 'title', // Calendar title
            right: 'timeGridDay,timeGridWeek,dayGridMonth' // Toggle daily and weekly views
        },
        slotMinTime: '08:00:00', // Start time: 8 AM
        slotMaxTime: '21:00:00', // End time: 8 PM
        slotDuration: '00:15:00', // 1-hour intervals
        locale: 'pl',
        allDaySlot: false, // Hide "all-day" section
        height: 'auto', // Auto-adjust height
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24-hour format
        },
        buttonText: {
            today: 'Dzisiaj',
            month: 'Miesiąc',
            week: 'Tydzień',
            day: 'Dzień',
        },

        events: [
            { title: 'Morning Meeting', start: '2025-01-09T09:00:00', end: '2025-01-09T10:00:00' },
            { title: 'Lunch Break', start: '2025-01-09T12:00:00', end: '2025-01-09T13:00:00' },
            { title: 'Workshop', start: '2025-01-10T14:00:00', end: '2025-01-10T16:00:00' }
        ]
    });
    calendar.render();
});
