import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parseISO, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const CalendarView = () => {
  const { attendanceRecords } = useAttendance();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const recordsForDay = attendanceRecords.filter(r => r.date === dateStr);
    
    if (recordsForDay.length === 0) return 'none';
    
    const present = recordsForDay.filter(r => r.status === 'Present').length;
    const total = recordsForDay.length;
    const percentage = present / total;

    if (percentage >= 0.8) return 'good';
    if (percentage >= 0.5) return 'average';
    return 'poor';
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">Monthly view of attendance trends</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b">
            <CardTitle className="text-lg">{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold uppercase text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysInMonth.map((day, i) => {
                const status = getDayStatus(day);
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center rounded-lg border text-sm transition-all relative group cursor-default",
                      !isSameMonth(day, currentDate) && "opacity-30",
                      isToday(day) && "ring-2 ring-primary ring-offset-2 ring-offset-background font-bold",
                      status === 'good' && "bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400",
                      status === 'average' && "bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400",
                      status === 'poor' && "bg-red-100 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400",
                      status === 'none' && "bg-card hover:bg-muted/50"
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded border bg-emerald-100 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800" />
              <span className="text-sm">Good Attendance (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded border bg-amber-100 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800" />
              <span className="text-sm">Average (50% - 80%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded border bg-red-100 border-red-200 dark:bg-red-950/40 dark:border-red-800" />
              <span className="text-sm">Poor Attendance (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded border bg-card" />
              <span className="text-sm text-muted-foreground">No Records</span>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20 flex gap-3 text-sm">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Colors represent the aggregate presence percentage across all classes for that specific date.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
