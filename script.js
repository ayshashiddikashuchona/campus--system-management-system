
// ==========================================
// CAMPUS EVENT MANAGEMENT SYSTEM
// JavaScript Main File
// ==========================================


// 1. Default Events

const defaultEvents = [
    {
        id: 1,
        title: "Programming Contest",
        category: "Technology",
        date: "2026-12-10",
        time: "10:00",
        location: "University Auditorium",
        seats: 100,
        description: "A programming competition for students. Participate and test your coding skills."
    },
    {
        id: 2,
        title: "Cultural Festival",
        category: "Cultural",
        date: "2026-12-15",
        time: "15:00",
        location: "University Campus",
        seats: 150,
        description: "Enjoy music, dance, cultural performances and many exciting activities."
    },
    {
        id: 3,
        title: "Football Tournament",
        category: "Sports",
        date: "2026-12-20",
        time: "09:00",
        location: "University Playground",
        seats: 80,
        description: "Join the university football tournament and enjoy the sporting activities."
    },
    {
        id: 4,
        title: "Web Development Workshop",
        category: "Workshop",
        date: "2026-12-25",
        time: "11:00",
        location: "Computer Lab",
        seats: 50,
        description: "Learn the fundamentals of web development and build your first website."
    },
    {
        id: 5,
        title: "Career Development Seminar",
        category: "Seminar",
        date: "2027-01-05",
        time: "12:00",
        location: "Conference Room",
        seats: 120,
        description: "Learn about career opportunities, professional skills and future planning."
    },
    {
        id: 6,
        title: "Robotics Exhibition",
        category: "Technology",
        date: "2027-01-12",
        time: "10:30",
        location: "Engineering Building",
        seats: 90,
        description: "Explore innovative robotics projects created by university students."
    }
];


// 2. Local Storage Setup

function loadData(key, defaultValue) {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        return defaultValue;
    }
}

let events = loadData("campusEvents", defaultEvents);
let registrations = loadData("campusRegistrations", []);

function saveEvents() {
    localStorage.setItem("campusEvents", JSON.stringify(events));
}

function saveRegistrations() {
    localStorage.setItem(
        "campusRegistrations",
        JSON.stringify(registrations)
    );
}


// 3. Helper Functions

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function getEventRegistrations(eventId) {
    return registrations.filter(function (registration) {
        return Number(registration.eventId) === Number(eventId);
    }).length;
}

function getAvailableSeats(event) {
    return Math.max(
        0,
        Number(event.seats) - getEventRegistrations(event.id)
    );
}

function formatDate(date) {
    if (!date) return "Not specified";

    return new Date(date + "T00:00:00").toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function formatTime(time) {
    if (!time) return "Not specified";

    const parts = time.split(":");
    let hour = Number(parts[0]);
    const minute = parts[1];

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return hour + ":" + minute + " " + period;
}


// 4. Display Events

function displayEvents(eventList = events) {
    const container = document.getElementById("eventContainer");

    if (eventList.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <h3>No Events Found</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = eventList.map(function (event) {
        return `
            <div class="event-card">

                <div class="event-top">
                    ${escapeHTML(event.category.charAt(0))}
                </div>

                <div class="event-info">

                    <span class="category">
                        ${escapeHTML(event.category)}
                    </span>

                    <h3>${escapeHTML(event.title)}</h3>

                    <p>📅 ${formatDate(event.date)}</p>

                    <p>⏰ ${formatTime(event.time)}</p>

                    <p>📍 ${escapeHTML(event.location)}</p>

                    <p>Available Seats:
                        <strong>${getAvailableSeats(event)}</strong>
                    </p>

                    <button
                        class="details-btn"
                        onclick="showEventDetails(${Number(event.id)})">
                        View Details
                    </button>

                </div>
            </div>
        `;
    }).join("");
}


// 5. Search Events

document.getElementById("searchInput").addEventListener(
    "input",
    filterEvents
);

document.getElementById("categoryFilter").addEventListener(
    "change",
    filterEvents
);

function filterEvents() {
    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const categoryValue = document
        .getElementById("categoryFilter")
        .value;

    const filteredEvents = events.filter(function (event) {
        const matchesSearch =
            event.title.toLowerCase().includes(searchValue) ||
            event.category.toLowerCase().includes(searchValue) ||
            event.location.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "All" ||
            event.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    displayEvents(filteredEvents);
}


// 6. Event Details Modal

function showEventDetails(eventId) {
    const event = events.find(function (item) {
        return Number(item.id) === Number(eventId);
    });

    if (!event) return;

    document.getElementById("eventDetails").innerHTML = `
        <span class="category">${escapeHTML(event.category)}</span>

        <h2>${escapeHTML(event.title)}</h2>

        <p><strong>Date:</strong> ${formatDate(event.date)}</p>

        <p><strong>Time:</strong> ${formatTime(event.time)}</p>

        <p><strong>Location:</strong> ${escapeHTML(event.location)}</p>

        <p><strong>Total Seats:</strong> ${Number(event.seats)}</p>

        <p><strong>Available Seats:</strong> ${getAvailableSeats(event)}</p>

        <h3>Description</h3>

        <p>${escapeHTML(event.description)}</p>

        <button class="main-btn"
            onclick="prepareRegistration(${Number(event.id)})">
            Register for This Event
        </button>
    `;

    document.getElementById("eventModal").classList.add("show");
}

function closeEventModal() {
    document.getElementById("eventModal").classList.remove("show");
}

function prepareRegistration(eventId) {
    document.getElementById("selectedEvent").value = eventId;

    closeEventModal();

    document.getElementById("register").scrollIntoView({
        behavior: "smooth"
    });
}


// 7. Event Dropdown

function updateEventDropdown() {
    const dropdown = document.getElementById("selectedEvent");

    const previousValue = dropdown.value;

    dropdown.innerHTML = `
        <option value="">Choose an Event</option>
    `;

    events.forEach(function (event) {
        const option = document.createElement("option");

        option.value = event.id;
        option.textContent =
            event.title + " (" + getAvailableSeats(event) + " seats left)";

        option.disabled = getAvailableSeats(event) <= 0;

        dropdown.appendChild(option);
    });

    if (
        events.some(function (event) {
            return String(event.id) === previousValue &&
                getAvailableSeats(event) > 0;
        })
    ) {
        dropdown.value = previousValue;
    }
}


// 8. Student Registration

document.getElementById("registrationForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const department =
            document.getElementById("studentDepartment").value;
        const eventId =
            Number(document.getElementById("selectedEvent").value);

        const selectedEvent = events.find(function (item) {
            return Number(item.id) === eventId;
        });

        if (!selectedEvent) {
            alert("Please select a valid event.");
            return;
        }

        if (getAvailableSeats(selectedEvent) <= 0) {
            alert("Sorry! No seats are available.");
            return;
        }

        const alreadyRegistered = registrations.some(function (item) {
            return (
                item.studentId.toLowerCase() === studentId.toLowerCase() &&
                Number(item.eventId) === eventId
            );
        });

        if (alreadyRegistered) {
            alert("You have already registered for this event.");
            return;
        }

        const newRegistration = {
            id: Date.now(),
            name: name,
            studentId: studentId,
            email: email,
            department: department,
            eventId: eventId,
            eventTitle: selectedEvent.title,
            registrationDate: new Date().toLocaleDateString()
        };

        registrations.push(newRegistration);

        saveRegistrations();

        alert("Registration Successful!");

        this.reset();

        updateAll();
    }
);


// 9. Student Registration History

function showStudentHistory() {
    const studentId = document
        .getElementById("historyStudentId")
        .value.trim();

    const container = document.getElementById("historyContainer");

    if (!studentId) {
        alert("Please enter your Student ID.");
        return;
    }

    const studentRegistrations = registrations.filter(function (item) {
        return item.studentId.toLowerCase() === studentId.toLowerCase();
    });

    if (studentRegistrations.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                No registration found for this Student ID.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="table-wrapper history-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Event Name</th>
                        <th>Department</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>

                <tbody>
                    ${studentRegistrations.map(function (item) {
                        return `
                            <tr>
                                <td>${escapeHTML(item.name)}</td>
                                <td>${escapeHTML(item.eventTitle)}</td>
                                <td>${escapeHTML(item.department)}</td>
                                <td>${escapeHTML(item.registrationDate)}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}


// 10. Admin Login

function openAdminLogin() {
    document.getElementById("adminLoginModal").classList.add("show");
}

function closeAdminLogin() {
    document.getElementById("adminLoginModal").classList.remove("show");
}

document.getElementById("adminLoginForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const username =
            document.getElementById("adminUsername").value;

        const password =
            document.getElementById("adminPassword").value;

        // Demo login only
        if (username === "admin" && password === "admin123") {
            closeAdminLogin();

            document.getElementById("adminDashboard")
                .classList.add("active");

            document.getElementById("adminDashboard")
                .scrollIntoView({ behavior: "smooth" });

            updateAll();

            this.reset();
        } else {
            alert("Incorrect username or password!");
        }
    }
);


// 11. Admin Logout

function adminLogout() {
    document.getElementById("adminDashboard")
        .classList.remove("active");

    document.getElementById("home")
        .scrollIntoView({ behavior: "smooth" });
}


// 12. Add and Edit Events

document.getElementById("eventForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const editId =
            document.getElementById("editEventId").value;

        const title =
            document.getElementById("eventTitle").value.trim();

        const category =
            document.getElementById("eventCategory").value;

        const date =
            document.getElementById("eventDate").value;

        const time =
            document.getElementById("eventTime").value;

        const location =
            document.getElementById("eventLocation").value.trim();

        const seats =
            Number(document.getElementById("eventSeats").value);

        const description =
            document.getElementById("eventDescription").value.trim();

        if (seats < 1) {
            alert("Total seats must be at least 1.");
            return;
        }

        if (editId) {
            const eventIndex = events.findIndex(function (item) {
                return Number(item.id) === Number(editId);
            });

            if (eventIndex === -1) return;

            const alreadyBooked = getEventRegistrations(Number(editId));

            if (seats < alreadyBooked) {
                alert("Total seats cannot be less than existing registrations.");
                return;
            }

            events[eventIndex] = {
                ...events[eventIndex],
                title,
                category,
                date,
                time,
                location,
                seats,
                description
            };

            alert("Event Updated Successfully!");
        } else {
            const newEvent = {
                id: Date.now(),
                title,
                category,
                date,
                time,
                location,
                seats,
                description
            };

            events.push(newEvent);

            alert("New Event Added Successfully!");
        }

        saveEvents();

        resetEventForm();

        updateAll();
    }
);


// 13. Edit Event

function editEvent(eventId) {
    const event = events.find(function (item) {
        return Number(item.id) === Number(eventId);
    });

    if (!event) return;

    document.getElementById("editEventId").value = event.id;
    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventCategory").value = event.category;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventTime").value = event.time;
    document.getElementById("eventLocation").value = event.location;
    document.getElementById("eventSeats").value = event.seats;
    document.getElementById("eventDescription").value =
        event.description;

    document.getElementById("eventFormTitle").textContent =
        "Update Event";

    document.getElementById("saveEventBtn").textContent =
        "Update Event";

    document.getElementById("eventForm").scrollIntoView({
        behavior: "smooth"
    });
}


// 14. Reset Event Form

function resetEventForm() {
    document.getElementById("eventForm").reset();

    document.getElementById("editEventId").value = "";

    document.getElementById("eventFormTitle").textContent =
        "Add New Event";

    document.getElementById("saveEventBtn").textContent =
        "Add Event";
}


// 15. Delete Event

function deleteEvent(eventId) {
    const event = events.find(function (item) {
        return Number(item.id) === Number(eventId);
    });

    if (!event) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete " + event.title + "?"
    );

    if (!confirmDelete) return;

    events = events.filter(function (item) {
        return Number(item.id) !== Number(eventId);
    });

    // Remove registrations related to deleted event
    registrations = registrations.filter(function (item) {
        return Number(item.eventId) !== Number(eventId);
    });

    saveEvents();
    saveRegistrations();

    alert("Event Deleted Successfully!");

    updateAll();
}


// 16. Display Admin Event Table

function displayAdminEvents() {
    const table = document.getElementById("adminEventTable");

    if (events.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">No events available.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = events.map(function (event) {
        return `
            <tr>
                <td>${escapeHTML(event.title)}</td>

                <td>${escapeHTML(event.category)}</td>

                <td>${formatDate(event.date)}</td>

                <td>${getAvailableSeats(event)}</td>

                <td>
                    <button class="action-btn edit-btn"
                        onclick="editEvent(${Number(event.id)})">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteEvent(${Number(event.id)})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}


// 17. Display Admin Registration Table

function displayAdminRegistrations() {
    const table =
        document.getElementById("adminRegistrationTable");

    if (registrations.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">No student registrations yet.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = registrations.map(function (item) {
        return `
            <tr>
                <td>${escapeHTML(item.name)}</td>

                <td>${escapeHTML(item.studentId)}</td>

                <td>${escapeHTML(item.email)}</td>

                <td>${escapeHTML(item.department)}</td>

                <td>${escapeHTML(item.eventTitle)}</td>

                <td>
                    <button class="action-btn delete-btn"
                        onclick="deleteRegistration(${Number(item.id)})">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}


// 18. Remove Student Registration

function deleteRegistration(registrationId) {
    const confirmDelete = confirm(
        "Do you want to remove this registration?"
    );

    if (!confirmDelete) return;

    registrations = registrations.filter(function (item) {
        return Number(item.id) !== Number(registrationId);
    });

    saveRegistrations();

    alert("Registration Removed Successfully!");

    updateAll();
}


// 19. Update Statistics

function updateStatistics() {
    const totalSeats = events.reduce(function (total, event) {
        return total + Number(event.seats);
    }, 0);

    const availableSeats = events.reduce(function (total, event) {
        return total + getAvailableSeats(event);
    }, 0);

    document.getElementById("totalEvents").textContent =
        events.length;

    document.getElementById("totalRegistrations").textContent =
        registrations.length;

    document.getElementById("availableSeats").textContent =
        availableSeats;

    document.getElementById("adminEventCount").textContent =
        events.length;

    document.getElementById("adminRegistrationCount").textContent =
        registrations.length;

    document.getElementById("adminSeatCount").textContent =
        availableSeats;
}


// 20. Update Everything

function updateAll() {
    displayEvents();
    updateEventDropdown();
    displayAdminEvents();
    displayAdminRegistrations();
    updateStatistics();
}


// 21. Close Modals by Clicking Outside

document.getElementById("eventModal").addEventListener(
    "click",
    function (event) {
        if (event.target === this) {
            closeEventModal();
        }
    }
);

document.getElementById("adminLoginModal").addEventListener(
    "click",
    function (event) {
        if (event.target === this) {
            closeAdminLogin();
        }
    }
);


// 22. Start Application

updateAll();

console.log("Campus Event Management System is running!");
