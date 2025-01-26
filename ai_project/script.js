"use strict";

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
    // kontrast
    const highContrastToggle = document.getElementById("high-contrast-toggle");
    const isHighContrast = localStorage.getItem("high-contrast") === "true";
    if (isHighContrast) {
        document.body.classList.add("high-contrast");
    }

    highContrastToggle.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        const highContrastEnabled = document.body.classList.contains("high-contrast");
        localStorage.setItem("high-contrast", highContrastEnabled.toString());
    });

    // font resizing
    const increaseFontSizeButton = document.getElementById("increase-font-size");
    const decreaseFontSizeButton = document.getElementById("decrease-font-size");

    const adjustFontSize = (adjustment) => {
        const root = document.documentElement; 
        const currentFontSize = parseFloat(getComputedStyle(root).fontSize);
        const newFontSize = Math.max(10, Math.min(currentFontSize + adjustment, 24));
        root.style.fontSize = `${newFontSize}px`;
        localStorage.setItem("font-size", newFontSize); 
    };

    const savedFontSize = localStorage.getItem("font-size");
    if (savedFontSize) {
        document.documentElement.style.fontSize = `${savedFontSize}px`;
    }

    increaseFontSizeButton.addEventListener("click", () => adjustFontSize(2));
    decreaseFontSizeButton.addEventListener("click", () => adjustFontSize(-2));


    const saveIndeksToLocalStorage = () => {
        const indeksInput = document.querySelector('input[name="indeks"]');
        localStorage.setItem('indeks', indeksInput.value.trim());
    };

    const loadIndeksFromLocalStorage = () => {
        const indeksInput = document.querySelector('input[name="indeks"]');
        const savedIndeks = localStorage.getItem('indeks');
        if (savedIndeks) {
            indeksInput.value = savedIndeks;
        }
    };

    loadIndeksFromLocalStorage();

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

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridDay",
        headerToolbar: {
            //left: "prev,next today",
            left: "today prev next",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth,semesterButton"
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
                buttonText: 'Custom Range',
                headerToolbar: {
                    left: "today",
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton'
                },
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

        events: [],

        eventMouseEnter: function(info){
            const event = info.event;
            const tooltipContent = `
            <div><strong>${event.title}</strong></div>
            <div><strong>Wykładowca:</strong> ${event.extendedProps.teacher}</div>
            <div><strong>Pokój:</strong> ${event.extendedProps.location}</div>
            <div><strong>Grupa:</strong> ${event.extendedProps.group}</div>
            <div><strong>Statystyki:</strong> ${event.extendedProps.description}</div>
        `;

            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = tooltipContent;
            document.body.appendChild(tooltip);


            tooltip.style.position = 'absolute';
            tooltip.style.top = `${info.jsEvent.pageY + 10}px`;
            tooltip.style.left = `${info.jsEvent.pageX + 10}px`;
            tooltip.style.backgroundColor = '#fff';
            tooltip.style.border = '1px solid #ccc';
            tooltip.style.padding = '10px';
            tooltip.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            tooltip.style.zIndex = '9999';


            info.el.addEventListener('mouseleave', function() {
                tooltip.remove();
            });
        }
    });

    calendar.render();

    window.addEventListener('resize', function () {
        calendar.setOption('titleFormat', getTitleFormat());
    });

    calendar.on('datesSet', function (info) {
        if (info.view.type === 'semester1View' || info.view.type === 'semester2View') {
            isCustomView = true;
            updateCustomButtons();

        } else {
            isCustomView = false;
            resetCustomButtons();
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
            calendar.setOption('headerToolbar', {
                left: "",
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton'
            });

        } else {
            alert('Błędny zakres!');
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
            { data: "2025-01-07", godzina: "12:00", przedmiot: "Sztuczna Inteligencja", sala: "313", wykladowca: "dr inż. Joanna Kołodziejczyk", grupa: "336", indeks: "43434" },
            { data: "2025-01-14", godzina: "08:00", przedmiot: "Aplikacje Internetowe 1", sala: "303", wykladowca: "mgr Aleksandra Karczmarczyk", grupa: "336", indeks: "51000" },
            { data: "2025-01-15", godzina: "10:00", przedmiot: "Podstawy Ochrony Informacji", sala: "120", wykladowca: "dr hab. inż. Tomasz Hyla", grupa: "336", indeks: "49999" },
            { data: "2025-01-20", godzina: "12:00", przedmiot: "Sztuczna Inteligencja", sala: "313", wykladowca: "dr inż. Joanna Kołodziejczyk", grupa: "336", indeks: "43434" },
            { data: "2025-01-06", godzina: "08:00", przedmiot: "Sieci Komputerowe", sala: "310", wykladowca: "dr inż. Marek Jaskuła", grupa: "336", indeks: "51001" },
            { data: "2025-01-06", godzina: "10:00", przedmiot: "Podstawy Ochrony Informacji", sala: "120", wykladowca: "dr hab. inż. Tomasz Hyla", grupa: "336", indeks: "49999" },
            { data: "2025-01-07", godzina: "12:00", przedmiot: "Język angielski 2", sala: "313", wykladowca: "mgr Małgorzata Kos", grupa: "336", indeks: "44455" }
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
                end: endDate,

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
            calendar.gotoDate(new Date(currentYear-1, 9, 1));
        }
    }

    function updateCustomButtons() {
        calendar.setOption('headerToolbar', {
            left: "customToday customPrev customNext",
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton'
        });
    }

    function resetCustomButtons() {
        calendar.setOption('headerToolbar', {
            left: "today prev next",
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton'
        });

    }
});

function saveFilters() {
    const indeks = document.querySelector('input[name="indeks"]').value;
    const wykladowca = document.querySelector('input[name="wykladowca"]').value;
    const grupa = document.querySelector('input[name="grupa"]').value;
    const sala = document.querySelector('input[name="sala"]').value;
    const przedmiot = document.querySelector('input[name="przedmiot"]').value;

    if (!indeks && !wykladowca && !grupa && !sala && !przedmiot) {
        alert('Wypełnij przynajmniej jedno pole przed zapisaniem.');
        return;
    }

    const filterName = prompt('Wpisz nazwę dla filtra:', 'Mój filtr');
    if (!filterName) {
        alert('Nazwa filtra jest wymagana!');
        return;
    }

    const filters = {
        name: filterName,
        indeks,
        wykladowca,
        grupa,
        sala,
        przedmiot
    };

    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites.push(filters);
    localStorage.setItem('favourites', JSON.stringify(favourites));

    alert(`Filtr "${filterName}" został zapisany do ulubionych!`);
}

function showFavourites() {
    const favouritesContainer = document.getElementById('favourites-container');
    const favouritesList = document.getElementById('favourites-list');
    favouritesList.innerHTML = '';
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    favourites.forEach((filter, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            ${filter.name}
            <div id="load-del-buttons">
            <button onclick="loadFilters(${index})" id="load-btn"><i class="bi bi-upload" title="Wczytaj"></i></button>
            <button onclick="removeFilters(${index})" id="del-btn"><i class="bi bi-trash3" title="Usuń"></i></button>
            </div>
        `;
        favouritesList.appendChild(li);
    });
    favouritesContainer.style.display = favouritesContainer.style.display === 'none' ? 'block' : 'none';
}

function removeFilters(index) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const filterName = favourites[index].name;
    favourites.splice(index, 1);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert(`Filtr "${filterName}" został usunięty z ulubionych.`);
    showFavourites();
}
function loadFilters(index) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const filter = favourites[index];
    document.querySelector('input[name="indeks"]').value = filter.indeks;
    document.querySelector('input[name="wykladowca"]').value = filter.wykladowca;
    document.querySelector('input[name="grupa"]').value = filter.grupa;
    document.querySelector('input[name="sala"]').value = filter.sala;
    document.querySelector('input[name="przedmiot"]').value = filter.przedmiot;
}

document.getElementById('fav-display').addEventListener('click', showFavourites);
document.getElementById('save-to-favourites').addEventListener('click', saveFilters);

document.getElementById('generate-url').addEventListener('click', function() {
    const params = new URLSearchParams();

    document.querySelectorAll('#input-container .input-group input').forEach(input => {
        if (input.value) {
            params.append(input.name, input.value);
        }
    });

    const baseUrl = window.location.origin + window.location.pathname;
    const generatedUrl = `${baseUrl}?${params.toString()}`;
    document.getElementById('generated-url').value = generatedUrl;
});

document.getElementById('copy-url').addEventListener('click', function() {

    var urlInput = document.getElementById('generated-url');

    urlInput.select();

    copyURLToClipboard(urlInput.value);
});

async function copyURLToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert("URL został skopiowany do schowka!");
    } catch {
        alert("Błąd przy kopiowaniu do schowka!")
    }
}
