# Attendance Pro - Student Attendance Management System

A complete production-style Student Attendance System built with React, Vite, Tailwind CSS (v4), Context API, and LocalStorage. Designed with a modern, responsive SaaS-grade UI.

## Features

- **Authentication System**: Mock auth (Teacher login/registration).
- **Dashboard**: Real-time analytics, charts (Recharts), and quick stats.
- **Student Management**: Add, edit, delete, search, and filter students with a beautifully designed table.
- **Attendance Marking**: Bulk attendance system. Select date/class, see a list of students, mark all present, edit previous attendance.
- **Reports Module**: Generate reports by Class, Student, or Daily. View graphical statistics, identify defaulters, and print/export to CSV/PDF (mocked).
- **Calendar View**: Visual heatmap of aggregate attendance status across the month.
- **Settings**: Profile configuration, theme selection, and system factory reset.

## Tech Stack

- **React 19 & Vite** (Fast build tool)
- **Tailwind CSS v4** (Utility-first styling, native CSS variables)
- **React Router DOM v7** (Client-side routing)
- **Context API & LocalStorage** (Global state management & Persistence)
- **Lucide React** (Beautiful consistent icons)
- **Recharts** (Interactive charts)
- **React Hot Toast** (Toast notifications)
- **date-fns** (Date manipulation)
- **clsx & tailwind-merge** (Utility classes merger)

## Setup Instructions

1. **Install dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will run locally (typically at `http://localhost:5173`).

3. **Login / Mock Data**
   - Click "Use Demo Credentials" on the login page or register a new teacher.
   - On the first load, the app automatically generates 60 realistic mock students across different departments and classes, along with 30 days of past attendance history.

## Architecture

```
src/
├── components/
│   ├── ui/             # Reusable atomic UI components (Button, Card, Input, Modal, etc.)
│   ├── Navbar.jsx      # Top navigation with user profile & theme toggle
│   └── Sidebar.jsx     # Side navigation menu
├── context/
│   ├── AttendanceContext.jsx # Core business logic & persistence
│   ├── AuthContext.jsx       # Teacher session management
│   └── ThemeContext.jsx      # Dark/Light mode management
├── layouts/
│   └── DashboardLayout.jsx   # Wrapping layout for authenticated pages
├── pages/
│   ├── Login.jsx, Register.jsx
│   ├── Dashboard.jsx
│   ├── Students.jsx
│   ├── Attendance.jsx
│   ├── Reports.jsx
│   ├── Calendar.jsx
│   └── Settings.jsx
├── utils/
│   ├── cn.js           # ClassName merger utility
│   └── mockData.js     # Data generation engine
├── App.jsx             # Main router configuration
└── main.jsx            # React entry point
```

## Features Deep Dive

- **Dynamic Dark Mode:** Seamless transition between light and dark themes using CSS variables and Tailwind v4.
- **Responsive Layout:** Works flawlessly on desktops, tablets, and mobile devices.
- **Glassmorphism UI:** Soft shadows, rounded borders, and subtle blur effects for a premium SaaS feel.
- **Persistence:** Everything you do is saved locally. You can close the tab and return later without losing data.
