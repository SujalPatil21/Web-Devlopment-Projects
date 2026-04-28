# Calendar & Task Management Web App

A fully functional **calendar-based productivity web application** built using HTML, CSS, and JavaScript.

This application allows users to **schedule events, manage tasks, take notes, and track productivity** with an interactive calendar interface and dashboard.

---

## Features

- User Authentication (Login / Register)
- Weekly, Monthly, and Yearly calendar views
- Create, edit, and delete events
- Event categorization with color coding
- Real-time “current time” indicator
- Notes management system
- Dashboard with task analytics (total, completed, pending, overdue)
- Export schedules as CSV
- Deleted items recovery (trash system)
- Persistent data using LocalStorage

---

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (Vanilla JS)  
- LocalStorage API  

---

## Project Structure
```
project-folder/
│
├── index.html
├── style.css
└── app.js
```

---

## How to Run

1. Download or clone the project.
2. Keep all files in the same directory.
3. Open `index.html` in a browser.
4. Login using:
   - Email: `test@gmail.com`
   - Password: `1111`

---

## Core Functionalities

### 1. Calendar System
- Dynamic weekly calendar grid generation  
- Events rendered based on date and time slots  
- Supports:
  - Weekly view (default)
  - Monthly view
  - Yearly overview  

Reference: :contentReference[oaicite:0]{index=0}

---

### 2. Event Management
- Create schedules with:
  - Title
  - Date
  - Start & End time
  - Category & color
  - Notes
- Edit existing events
- Delete events → moved to trash
- Restore deleted events

---

### 3. Dashboard Analytics
- Displays:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
- Shows recent activity

---

### 4. Notes System
- Create and store notes
- Delete notes
- Persistent storage using LocalStorage

---

### 5. Authentication System
- Login and registration functionality
- Input validation (email, password)
- User session stored in LocalStorage

---

## Core Logic

- Calendar rendering is handled dynamically using:


- Event positioning:
- Calculated based on time → mapped to pixel height

- State management:
- `events[]` → all schedules  
- `notes[]` → stored notes  
- `trash[]` → deleted events  

---

## UI & Design

- Sidebar-based navigation layout  
- Card-based dashboard UI  
- Responsive design with grid system  
- Color-coded events for clarity  

Reference: :contentReference[oaicite:1]{index=1}

---

## Interface Overview

- Login screen  
- Dashboard  
- Calendar (Weekly / Monthly / Yearly)  
- Notes panel  
- Event creation modal  

Reference: :contentReference[oaicite:2]{index=2}

---

## Requirements

- Modern browser (Chrome recommended)
- JavaScript enabled

---

## Limitations

- No backend (data stored locally)
- No real authentication security
- Data is browser-dependent

---

## Future Improvements

- Backend integration (Node.js + MongoDB)
- Cloud sync
- Notifications & reminders
- Drag-and-drop scheduling
- Mobile optimization

---

## Purpose

This project demonstrates:

- Advanced DOM manipulation
- State management in frontend
- Real-world application structure
- Calendar and scheduling logic
- Clean UI/UX implementation

---

## Author

**Sujal Patil**

- Email: [sujalpatil21@gmail.com](mailto:sujalpatil21@gmail.com)
- GitHub: [SujalPatil21](https://github.com/SujalPatil21)