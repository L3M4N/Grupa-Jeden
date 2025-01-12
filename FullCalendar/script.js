"use strict";


document.addEventListener("DOMContentLoaded", function () {
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


	calendar.on('datesSet', function (info) {
		// Check the current view type
		if (info.view.type === 'semester1View' || info.view.type === 'semester2View') {
			// Enable custom semester behavior
			isCustomView = true;

			// Update button labels or behavior if needed
		} else {
			// Restore default buttons
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

			// Switch to the custom view and navigate to the start date
			calendar.changeView('customMultiDay');
			calendar.gotoDate(endDate);

		} else {
			alert('Please select a valid start date and duration.');
		}
	});

	// Obsługa wyszukiwania zajęć
	document.getElementById("search-button").addEventListener("click", () => {
		const salaInput = document.querySelector('input[name="sala"]').value.trim();
		const wykladowcaInput = document.querySelector('input[name="wykladowca"]').value.trim();
		const grupaInput = document.querySelector('input[name="grupa"]').value.trim();
		const przedmiotInput = document.querySelector('input[name="przedmiot"]').value.trim();

		// Dane "na sztywno"
		const plan = [
			{ data: "2025-01-06", godzina: "08:00", przedmiot: "Aplikacje Internetowe 1", sala: "A101", wykladowca: "Dr. Nowak", grupa: "336" },
			{ data: "2025-01-06", godzina: "10:00", przedmiot: "Podstawy Ochrony Informacji", sala: "B202", wykladowca: "Dr. Kowalski", grupa: "336" },
			{ data: "2025-01-07", godzina: "12:00", przedmiot: "Sztuczna Inteligencja", sala: "C303", wykladowca: "Dr. Nowak", grupa: "336" }
		];

		// Filtrowanie danych na podstawie wpisanych wartości
		const filteredPlan = plan.filter(entry => {
			return (
				(!salaInput || entry.sala.toLowerCase() === salaInput.toLowerCase()) &&
				(!wykladowcaInput || entry.wykladowca.toLowerCase() === wykladowcaInput.toLowerCase()) &&
				(!grupaInput || entry.grupa.toLowerCase() === grupaInput.toLowerCase()) &&
				(!przedmiotInput || entry.przedmiot.toLowerCase() === przedmiotInput.toLowerCase())
			);
		});

		// Obsługa przypadku, gdy brak wyników
		if (filteredPlan.length === 0) {
			alert("Brak wyników dla podanych kryteriów.");
			calendar.removeAllEvents(); // Czyszczenie kalendarza
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

		// Usunięcie istniejących wydarzeń i dodanie nowych
		calendar.removeAllEvents(); // Czyszczenie wydarzeń
		events.forEach(event => calendar.addEvent(event)); // Dodanie nowych wydarzeń
	});

	// Obsługa przycisku "Wyczyść"
	document.getElementById("clear-button").addEventListener("click", () => {
		document.querySelector('input[name="sala"]').value = "";
		document.querySelector('input[name="wykladowca"]').value = "";
		document.querySelector('input[name="grupa"]').value = "";
		document.querySelector('input[name="przedmiot"]').value = "";
		calendar.removeAllEvents();
		calendar.today();
	});

	// Obsługa semestrów
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
			left: 'prev,next today', // Navigation buttons
			center: 'title', // Calendar title
			right: 'timeGridDay,timeGridWeek,dayGridMonth,semesterButton' // Toggle daily and weekly views
		});
	}

	});


