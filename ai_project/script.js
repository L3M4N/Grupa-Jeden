"use strict";

// Zmiana motywu
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const logoDark = document.getElementById('logo');
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

document.addEventListener("DOMContentLoaded", function () {

    // Funkcja do zapisywania numeru indeksu w localStorage
    const saveIndeksToLocalStorage = () => {
        const indeksInput = document.querySelector('input[name="indeks"]');
        localStorage.setItem('indeks', indeksInput.value.trim());
    };

    // Funkcja do wczytywania numeru indeksu z localStorage
    const loadIndeksFromLocalStorage = () => {
        const indeksInput = document.querySelector('input[name="indeks"]');
        const savedIndeks = localStorage.getItem('indeks');
        if (savedIndeks) {
            indeksInput.value = savedIndeks;
        }
    };

    // Wczytaj numer indeksu z localStorage po załadowaniu strony
    loadIndeksFromLocalStorage();

    // Obsługuje zapisanie numeru indeksu przy zmianie
    document.querySelector('input[name="indeks"]').addEventListener('input', saveIndeksToLocalStorage);

    const getTitleFormat = () => {
        if (window.innerWidth < 1000) {
            return { month: 'short', year: 'numeric', day: 'numeric' };
        } else {
            return { month: 'long', year: 'numeric', day: 'numeric' };
        }
    };

    const calendarEl = document.getElementById("calendar");
    let isCustomView = false;

    // Inicjalizacja kalendarza FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridDay", // Domyślny widok
        headerToolbar: {
            left: "prev,next today", // Nawigacja
            center: "title", // Tytuł kalendarza
            right: "timeGridDay,timeGridWeek,dayGridMonth,semesterButton" // Widoki
        },
        slotMinTime: "08:00:00",
        slotMaxTime: "21:00:00",
        slotDuration: "00:15:00",
        locale: "pl",
        firstDay: 1,
        allDaySlot: false,
        height: "auto",
        noEventsContent: "Nie znaleziono zajęć w tym terminie :((((",
        slotLabelFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        },
        buttonText: {
            today: "Dziś",
            month: "Miesiąc",
            week: "Tydzień",
            day: "Dzień"
        },
        views: {
            semester1View: {
                type: "dayGrid",
                duration: { months: 5 }, // Październik - Luty
                buttonText: "1 Semestr"
            },
            semester2View: {
                type: "dayGrid",
                duration: { months: 7 }, // Marzec - Wrzesień
                buttonText: "2 Semestr"
            },
            customMultiDay: {
                type: 'list',
                buttonText: 'Custom Range'
            },
        },

        customButtons: {
            semesterButton: {
                text: "Semestr",
                click: function() {
                    switchToSemester(calendar);
                }
            },
            customPrev: {
                text: 'Poprzedni semestr',
                click: function() {
                    prevSemesterNavigation(calendar);
                }
            },
            customNext: {
                text: 'Następny semestr',
                click: function() {
                    nextSemesterNavigation(calendar);
                }
            },
            customToday: {
                text: 'Dziś',
                click: function() {
                    switchToSemester(calendar);
                }
            },
        },

        events: [], // Wydarzenia będą dodawane dynamicznie
    });

    calendar.render();

    window.addEventListener('resize', function () {
        calendar.setOption('titleFormat', getTitleFormat());
    });

    calendar.on('datesSet', function (info) {
        if (info.view.type === 'semester1View' || info.view.type === 'semester2View') {
            isCustomView = true;
        } else {
            isCustomView = false;
            updateCustomButtons();
        }
    });

    document.getElementById('apply-dates').addEventListener('click', function () {
        let startDateIn = document.getElementById('start-date').value;
        let endDateIn = document.getElementById('end-date').value;
        if(startDateIn && endDateIn) {

            const startDate = new Date(startDateIn);
            const endDate = new Date(endDateIn);

            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(endDate.getDate() + 1);
            calendar.setOption('visibleRange', {
                start: startDate.toISOString().split('T')[0],
                end: adjustedEndDate.toISOString().split('T')[0]
            });

            calendar.changeView('customMultiDay');
            calendar.gotoDate(endDate);

        } else {
            alert('Please select a valid start date and duration.');
        }
    });

    document.getElementById("search-button").addEventListener("click", () => {
        const salaInput = document.querySelector('input[name="sala"]').value.trim();
        const wykladowcaInput = document.querySelector('input[name="wykladowca"]').value.trim();
        const grupaInput = document.querySelector('input[name="grupa"]').value.trim();
        const przedmiotInput = document.querySelector('input[name="przedmiot"]').value.trim();
        const indeksInput = document.querySelector('input[name="indeks"]').value.trim();

        const plan = [
            { data: "2025-01-06", godzina: "08:00", przedmiot: "Aplikacje Internetowe 1", sala: "303", wykladowca: "mgr Aleksandra Karczmarczyk", grupa: "336", indeks: "51000" },
            { data: "2025-01-06", godzina: "10:00", przedmiot: "Podstawy Ochrony Informacji", sala: "120", wykladowca: "dr hab. inż. Tomasz Hyla", grupa: "336", indeks: "49999" },
            { data: "2025-01-07", godzina: "12:00", przedmiot: "Sztuczna Inteligencja", sala: "313", wykladowca: "dr inż. Joanna Kołodziejczyk", grupa: "336", indeks: "43434" }
        ];

        const filteredPlan = plan.filter(entry => {
            return (
                (!salaInput || entry.sala.toLowerCase() === salaInput.toLowerCase()) &&
                (!wykladowcaInput || entry.wykladowca.toLowerCase() === wykladowcaInput.toLowerCase()) &&
                (!grupaInput || entry.grupa.toLowerCase() === grupaInput.toLowerCase()) &&
                (!przedmiotInput || entry.przedmiot.toLowerCase() === przedmiotInput.toLowerCase()) &&
                (!indeksInput || entry.indeks.toLowerCase() === indeksInput.toLowerCase())
            );
        });

        if (filteredPlan.length === 0) {
            alert("Brak wyników dla podanych kryteriów.");
            calendar.removeAllEvents();
            return;
        }

        const events = filteredPlan.map(entry => {
            const startDate = `${entry.data}T${entry.godzina}:00`;
            const endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString();
            return {
                title: entry.przedmiot,
                start: startDate,
                end: endDate
            };
        });

        calendar.removeAllEvents();
        events.forEach(event => calendar.addEvent(event));
    });

    document.getElementById("clear-button").addEventListener("click", () => {
        document.querySelector('input[name="sala"]').value = "";
        document.querySelector('input[name="wykladowca"]').value = "";
        document.querySelector('input[name="grupa"]').value = "";
        document.querySelector('input[name="przedmiot"]').value = "";
        document.querySelector('input[name="indeks"]').value = "";
        calendar.removeAllEvents();
        calendar.today();
    });

    let currentSemester = 0;

    function switchToSemester(calendar) {
        const today = new Date();
        const currentMonth = today.getMonth();

        if (currentMonth >= 9 || currentMonth <= 1) {
            calendar.changeView("semester1View");
            calendar.gotoDate(new Date(today.getFullYear(), 9, 1));
            currentSemester = 1;
        } else {
            calendar.changeView("semester2View");
            calendar.gotoDate(new Date(today.getFullYear(), 2, 1));
            currentSemester = 2;
        }
    }

    function nextSemesterNavigation(calendar) {
        const visibleRangeStart = calendar.view.activeStart;
        const currentYear = visibleRangeStart.getFullYear();
        if (currentSemester === 1) {
            currentSemester = 2;
            calendar.changeView('semester2View');
            calendar.gotoDate(new Date(currentYear + 1, 2, 1));
        } else {
            currentSemester = 1;
            calendar.changeView('semester1View');
            calendar.gotoDate(new Date(currentYear, 9, 1));
        }
    }

    function prevSemesterNavigation(calendar) {
        const visibleRangeStart = calendar.view.activeStart;
        const currentYear = visibleRangeStart.getFullYear();
        if (currentSemester === 1) {
            currentSemester = 2;
            calendar.changeView('semester2View');
            calendar.gotoDate(new Date(currentYear, 2, 1));
        } else {
            currentSemester = 1;
            calendar.changeView('semester1View');
            calendar.gotoDate(new Date(currentYear -1, 9, 1));
        }
    }

    function updateCustomButtons() {
        calendar.setOption('headerToolbar', {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton'
        });
    }

});
