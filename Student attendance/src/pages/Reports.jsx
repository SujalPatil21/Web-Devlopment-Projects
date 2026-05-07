import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Printer, Filter, FileSpreadsheet, FileText, AlertTriangle } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const REPORT_TYPES = ["Class-wise Report", "Student-wise Report", "Daily Report", "Defaulter List"];

const Reports = () => {
  const { students, attendanceRecords } = useAttendance();
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [dateRange, setDateRange] = useState('month'); // week, month, custom
  const [customStartDate, setCustomStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Calculate Date Range
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let start, end = today;
    if (dateRange === 'month') {
      start = startOfMonth(today);
    } else if (dateRange === 'week') {
      start = subDays(today, 7);
    } else {
      start = parseISO(customStartDate);
      end = parseISO(customEndDate);
    }
    return { startDate: start, endDate: end };
  }, [dateRange, customStartDate, customEndDate]);

  // Filter Records by Date
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const recordDate = parseISO(record.date);
      return isWithinInterval(recordDate, { start: startDate, end: endDate });
    });
  }, [attendanceRecords, startDate, endDate]);

  // Generate Data based on Report Type
  const reportData = useMemo(() => {
    if (reportType === "Student-wise Report" || reportType === "Defaulter List") {
      const studentStats = students.map(student => {
        const studentRecords = filteredRecords.filter(r => r.studentId === student.id);
        const total = studentRecords.length;
        const present = studentRecords.filter(r => r.status === 'Present').length;
        const absent = studentRecords.filter(r => r.status === 'Absent').length;
        const late = studentRecords.filter(r => r.status === 'Late').length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return {
          ...student,
          total,
          present,
          absent,
          late,
          percentage
        };
      }).filter(s => s.total > 0); // Only students with records in this period

      if (reportType === "Defaulter List") {
        return studentStats.filter(s => s.percentage < 75).sort((a, b) => a.percentage - b.percentage);
      }
      return studentStats.sort((a, b) => b.percentage - a.percentage);
    } 
    
    if (reportType === "Class-wise Report") {
      const classMap = {};
      filteredRecords.forEach(record => {
        const student = students.find(s => s.id === record.studentId);
        if (!student) return;
        
        const className = `${student.className} - ${student.division}`;
        if (!classMap[className]) {
          classMap[className] = { name: className, total: 0, present: 0, absent: 0 };
        }
        classMap[className].total++;
        if (record.status === 'Present') classMap[className].present++;
        if (record.status === 'Absent') classMap[className].absent++;
      });
      
      return Object.values(classMap).map(c => ({
        ...c,
        percentage: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0
      }));
    }

    // Daily Report
    const dailyMap = {};
    filteredRecords.forEach(record => {
      if (!dailyMap[record.date]) {
        dailyMap[record.date] = { date: record.date, total: 0, present: 0, absent: 0 };
      }
      dailyMap[record.date].total++;
      if (record.status === 'Present') dailyMap[record.date].present++;
      if (record.status === 'Absent') dailyMap[record.date].absent++;
    });

    return Object.values(dailyMap)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(d => ({
        ...d,
        percentage: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0
      }));

  }, [reportType, students, filteredRecords]);

  const handleExport = (format) => {
    toast.success(`Exporting as ${format}...`);
    // Mock export logic
    setTimeout(() => {
      toast.success(`${format} export complete! Check your downloads.`);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and export attendance reports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => handleExport('CSV')} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
            <FileText className="h-4 w-4" /> PDF
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <Card className="print:hidden border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {REPORT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-card px-2 py-2 text-sm"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-card px-2 py-2 text-sm"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="hidden print:block text-center mb-8">
        <h2 className="text-2xl font-bold">{reportType}</h2>
        <p className="text-gray-500">Period: {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}</p>
      </div>

      <div className="grid gap-6">
        {/* Charts Section - only show for class or daily reports */}
        {(reportType === "Class-wise Report" || reportType === "Daily Report") && reportData.length > 0 && (
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey={reportType === "Daily Report" ? "date" : "name"} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <RechartsTooltip 
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar dataKey="percentage" name="Attendance %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4 print:hidden border-b">
            <CardTitle className="text-lg">Generated Data</CardTitle>
            <div className="text-sm text-muted-foreground">{reportData.length} records found</div>
          </CardHeader>
          <CardContent className="p-0 print:p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground print:bg-gray-100 print:text-gray-800 border-b">
                  <tr>
                    {(reportType === "Student-wise Report" || reportType === "Defaulter List") && (
                      <>
                        <th className="px-6 py-4">Roll No</th>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Class</th>
                      </>
                    )}
                    {reportType === "Class-wise Report" && <th className="px-6 py-4">Class & Division</th>}
                    {reportType === "Daily Report" && <th className="px-6 py-4">Date</th>}
                    
                    <th className="px-6 py-4 text-center">Total Classes</th>
                    <th className="px-6 py-4 text-center text-emerald-600">Present</th>
                    <th className="px-6 py-4 text-center text-red-600">Absent</th>
                    <th className="px-6 py-4 text-center text-primary">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y print:divide-gray-200">
                  {reportData.length > 0 ? (
                    reportData.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30 print:hover:bg-transparent">
                        {(reportType === "Student-wise Report" || reportType === "Defaulter List") && (
                          <>
                            <td className="px-6 py-4 font-medium">{row.rollNumber}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{row.name}</div>
                              {reportType === "Defaulter List" && (
                                <div className="text-xs text-destructive flex items-center gap-1 mt-1 print:hidden">
                                  <AlertTriangle className="h-3 w-3" /> Action Required
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{row.className}-{row.division}</td>
                          </>
                        )}
                        {reportType === "Class-wise Report" && <td className="px-6 py-4 font-medium">{row.name}</td>}
                        {reportType === "Daily Report" && <td className="px-6 py-4 font-medium">{format(parseISO(row.date), 'MMM dd, yyyy')}</td>}
                        
                        <td className="px-6 py-4 text-center font-medium">{row.total}</td>
                        <td className="px-6 py-4 text-center">{row.present}</td>
                        <td className="px-6 py-4 text-center">{row.absent}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold",
                            row.percentage >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
                          )}>
                            {row.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-muted-foreground">
                        No records found for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
