"use strict";

// Dane "na sztywno"
const plan = [
    { data: "2025-01-06", godzina: "08:00", przedmiot: "Aplikacje Internetowe 1", sala: "303", wykladowca: "mgr Aleksandra Karczmarczyk", grupa: "336" },
    { data: "2025-01-06", godzina: "10:00", przedmiot: "Podstawy Ochrony Informacji", sala: "120", wykladowca: "dr hab. inż. Tomasz Hyla", grupa: "336" },
    { data: "2025-01-07", godzina: "12:00", przedmiot: "Sztuczna Inteligencja", sala: "313", wykladowca: "dr inż. Joanna Kołodziejczyk", grupa: "336" }
];

const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const logoDark = document.getElementById("logo");

// Funkcja zmiany motywu
const switchTheme = (isDark) => {
    if (isDark) {
        body.classList.add("dark");
        logoDark.style.backgroundColor = "gray"; // Przykład stylu dla ciemnego motywu
    } else {
        body.classList.remove("dark");
        logoDark.style.backgroundColor = "white"; // Przykład stylu dla jasnego motywu
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Przywracanie poprzedniego motywu (z localStorage)
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";
    switchTheme(isDarkMode);
    themeToggle.checked = isDarkMode;

    // Obsługa kliknięcia przełącznika
    themeToggle.addEventListener("change", () => {
        switchTheme(themeToggle.checked);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    // Inicjalizacja kalendarza FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek", // Widok tygodniowy
        headerToolbar: {
            left: "prev,next today", // Nawigacja
            center: "title", // Tytuł kalendarza
            right: "timeGridDay,timeGridWeek,dayGridMonth" // Widoki
        },
        slotMinTime: "08:00:00", // Czas startowy
        slotMaxTime: "21:00:00", // Czas końcowy
        allDaySlot: false, // Brak sekcji całodniowej
        height: "auto", // Automatyczna wysokość
        locale: "pl", // Język polski
        events: [] // Pusta tablica na wydarzenia
    });

    calendar.render();

    // Obsługa kliknięcia przycisku "Szukaj"
    document.getElementById("search-button").addEventListener("click", () => {
        const salaInput = document.querySelector('input[name="sala"]').value.trim(); // Pobranie wartości z pola "Sala"
        const wykladowcaInput = document.querySelector('input[name="wykladowca"]').value.trim(); // Pobranie wartości z pola "Wykładowca"
        const grupaInput = document.querySelector('input[name="grupa"]').value.trim(); // Pobranie wartości z pola "Grupa"
        const przedmiotInput = document.querySelector('input[name="przedmiot"]').value.trim(); // Pobranie wartości z pola "Przedmiot"

        console.log("Wpisana sala:", salaInput);
        console.log("Wpisany wykładowca:", wykladowcaInput);
        console.log("Wpisana grupa:", grupaInput);
        console.log("Wpisany przedmiot:", przedmiotInput);

        // Filtrowanie danych na podstawie wpisanych wartości
        const filteredPlan = plan.filter(entry => {
            return (
                (!salaInput || entry.sala.toLowerCase() === salaInput.toLowerCase()) &&
                (!wykladowcaInput || entry.wykladowca.toLowerCase() === wykladowcaInput.toLowerCase()) &&
                (!grupaInput || entry.grupa.toLowerCase() === grupaInput.toLowerCase()) &&
                (!przedmiotInput || entry.przedmiot.toLowerCase() === przedmiotInput.toLowerCase())
            );
        });

        console.log("Filtrowane wyniki:", filteredPlan);

        if (filteredPlan.length === 0) {
            alert("Brak wyników dla podanych kryteriów.");
            calendar.removeAllEvents(); // Czyszczenie kalendarza, jeśli brak wyników
            return;
        }

        // Przekształcanie danych na format FullCalendar
        const events = filteredPlan.map(entry => {
            const startDate = `${entry.data}T${entry.godzina}:00`;
            const endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString(); // Dodanie 1 godziny
            return {
                title: entry.przedmiot,
                start: startDate,
                end: endDate
            };
        });

        console.log("Przekształcone wydarzenia:", events);

        // Usunięcie istniejących wydarzeń i dodanie nowych
        calendar.removeAllEvents(); // Czyszczenie wydarzeń
        events.forEach(event => calendar.addEvent(event)); // Dodanie nowych wydarzeń

    });

    document.getElementById("clear-button").addEventListener("click", () => {
        // Wyczyść pola formularza
        document.querySelector('input[name="sala"]').value = "";
        document.querySelector('input[name="wykladowca"]').value = "";
        document.querySelector('input[name="grupa"]').value = "";
        document.querySelector('input[name="przedmiot"]').value = "";

        // Wyczyść wydarzenia z kalendarza
        calendar.removeAllEvents();

        // Reset widoku kalendarza do dnia dzisiejszego
        calendar.today();

        console.log("Formularz i kalendarz zostały wyczyszczone.");
    });

});
