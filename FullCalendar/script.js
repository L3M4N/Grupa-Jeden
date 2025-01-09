document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
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
            today: 'Dziś',
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
