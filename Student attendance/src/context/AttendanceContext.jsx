import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateMockData } from '../utils/mockData';
import toast from 'react-hot-toast';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // Clean up old version data
    localStorage.removeItem('attendance_students');
    localStorage.removeItem('attendance_records');

    const storedStudents = localStorage.getItem('attendance_students_v2');
    const storedRecords = localStorage.getItem('attendance_records_v2');

    if (!storedStudents || !storedRecords) {
      console.log('Generating mock data...');
      const { students: mockStudents, attendanceRecords: mockRecords } = generateMockData();
      setStudents(mockStudents);
      setAttendanceRecords(mockRecords);
      localStorage.setItem('attendance_students_v2', JSON.stringify(mockStudents));
      localStorage.setItem('attendance_records_v2', JSON.stringify(mockRecords));
    } else {
      setStudents(JSON.parse(storedStudents));
      setAttendanceRecords(JSON.parse(storedRecords));
    }
    setLoading(false);
  }, []);

  // Save changes to localStorage
  const saveStudents = (newStudents) => {
    setStudents(newStudents);
    localStorage.setItem('attendance_students_v2', JSON.stringify(newStudents));
  };

  const saveRecords = (newRecords) => {
    setAttendanceRecords(newRecords);
    localStorage.setItem('attendance_records_v2', JSON.stringify(newRecords));
  };

  // Student Actions
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: `STU${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    saveStudents([...students, newStudent]);
    toast.success('Student added successfully');
  };

  const updateStudent = (id, updatedData) => {
    saveStudents(students.map(s => s.id === id ? { ...s, ...updatedData } : s));
    toast.success('Student updated successfully');
  };

  const deleteStudent = (id) => {
    saveStudents(students.filter(s => s.id !== id));
    saveRecords(attendanceRecords.filter(r => r.studentId !== id)); // Cleanup records
    toast.success('Student deleted successfully');
  };

  // Attendance Actions
  const markAttendance = (records) => {
    // records is an array of { studentId, date, status }
    const updatedRecords = [...attendanceRecords];
    
    records.forEach(newRecord => {
      const existingIndex = updatedRecords.findIndex(
        r => r.studentId === newRecord.studentId && r.date === newRecord.date
      );
      
      if (existingIndex >= 0) {
        updatedRecords[existingIndex] = { ...updatedRecords[existingIndex], status: newRecord.status };
      } else {
        updatedRecords.push({
          id: `ATT${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
          ...newRecord,
          markedBy: 'teacher',
          timestamp: new Date().toISOString()
        });
      }
    });

    saveRecords(updatedRecords);
    toast.success('Attendance saved successfully');
  };

  const getAttendanceByDateAndClass = useCallback((date, className, division) => {
    const classStudents = students.filter(s => s.className === className && (!division || s.division === division));
    const records = attendanceRecords.filter(r => r.date === date);
    
    return classStudents.map(student => {
      const record = records.find(r => r.studentId === student.id);
      return {
        ...student,
        status: record ? record.status : null
      };
    });
  }, [students, attendanceRecords]);

  const resetData = () => {
    localStorage.removeItem('attendance_students_v2');
    localStorage.removeItem('attendance_records_v2');
    window.location.reload();
  };

  return (
    <AttendanceContext.Provider value={{
      students,
      attendanceRecords,
      loading,
      addStudent,
      updateStudent,
      deleteStudent,
      markAttendance,
      getAttendanceByDateAndClass,
      resetData
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
