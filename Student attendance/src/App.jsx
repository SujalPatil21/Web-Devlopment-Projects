import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import CalendarView from './pages/Calendar';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AttendanceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="reports" element={<Reports />} />
                <Route path="calendar" element={<CalendarView />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-card dark:text-foreground dark:border dark:border-border',
              }} 
            />
          </BrowserRouter>
        </AttendanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
