import React, { useState, useMemo, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Save, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const CLASSES = ["First Year", "Second Year", "Third Year", "Final Year"];
const DIVISIONS = ["A", "B", "C"];

const StatusButton = ({ status, currentStatus, onClick }) => {
  const isSelected = currentStatus === status;
  
  let colors = "";
  let Icon = null;
  
  if (status === 'Present') {
    colors = isSelected ? "bg-emerald-500 text-white border-emerald-500" : "text-emerald-500 border-border hover:bg-emerald-50";
    Icon = CheckCircle2;
  } else if (status === 'Absent') {
    colors = isSelected ? "bg-red-500 text-white border-red-500" : "text-red-500 border-border hover:bg-red-50";
    Icon = XCircle;
  } else {
    colors = isSelected ? "bg-amber-500 text-white border-amber-500" : "text-amber-500 border-border hover:bg-amber-50";
    Icon = Clock;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
        colors
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{status}</span>
    </button>
  );
};

const Attendance = () => {
  const { getAttendanceByDateAndClass, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[0]);
  
  const [studentList, setStudentList] = useState([]);
  const [attendanceState, setAttendanceState] = useState({}); // { studentId: status }

  useEffect(() => {
    const list = getAttendanceByDateAndClass(selectedDate, selectedClass, selectedDivision);
    setStudentList(list);
    
    // Initialize state
    const initialState = {};
    list.forEach(s => {
      if (s.status) initialState[s.id] = s.status;
    });
    setAttendanceState(initialState);
  }, [selectedDate, selectedClass, selectedDivision, getAttendanceByDateAndClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const newState = {};
    studentList.forEach(s => {
      newState[s.id] = status;
    });
    setAttendanceState(newState);
  };

  const handleSave = () => {
    const recordsToSave = Object.entries(attendanceState).map(([studentId, status]) => ({
      studentId,
      date: selectedDate,
      status
    }));

    if (recordsToSave.length === 0) {
      toast.error('No attendance marked to save.');
      return;
    }

    markAttendance(recordsToSave);
  };

  const stats = useMemo(() => {
    const total = studentList.length;
    const present = Object.values(attendanceState).filter(s => s === 'Present').length;
    const absent = Object.values(attendanceState).filter(s => s === 'Absent').length;
    const late = Object.values(attendanceState).filter(s => s === 'Late').length;
    const unmarked = total - present - absent - late;
    
    return { total, present, absent, late, unmarked };
  }, [studentList, attendanceState]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
        <p className="text-muted-foreground mt-1">Record daily attendance for classes</p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedDate}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Class</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Division</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {DIVISIONS.map(div => <option key={div} value={div}>{div}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {studentList.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Student List ({studentList.length})
              </CardTitle>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="text-emerald-500 font-medium">{stats.present} Present</span>
                <span className="text-red-500 font-medium">{stats.absent} Absent</span>
                <span className="text-amber-500 font-medium">{stats.late} Late</span>
                {stats.unmarked > 0 && <span className="text-muted-foreground">{stats.unmarked} Unmarked</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => markAll('Present')} className="text-emerald-500 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                Mark All Present
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save Records
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
                  <tr>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {studentList.map(student => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{student.rollNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <StatusButton 
                            status="Present" 
                            currentStatus={attendanceState[student.id]} 
                            onClick={() => handleStatusChange(student.id, 'Present')} 
                          />
                          <StatusButton 
                            status="Absent" 
                            currentStatus={attendanceState[student.id]} 
                            onClick={() => handleStatusChange(student.id, 'Absent')} 
                          />
                          <StatusButton 
                            status="Late" 
                            currentStatus={attendanceState[student.id]} 
                            onClick={() => handleStatusChange(student.id, 'Late')} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Students Found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              There are no students registered in {selectedClass} - Division {selectedDivision}. 
              Please add students to this class first.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Attendance;
