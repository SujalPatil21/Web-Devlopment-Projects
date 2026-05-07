import React, { useMemo } from 'react';
import { Users, UserCheck, UserX, Percent } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { format, parseISO } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { students, attendanceRecords } = useAttendance();

  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceRecords.filter(r => r.date === todayStr);
    
    const presentCount = todayRecords.filter(r => r.status === 'Present').length;
    const absentCount = todayRecords.filter(r => r.status === 'Absent').length;
    
    // Total percentages overall
    const totalPresent = attendanceRecords.filter(r => r.status === 'Present').length;
    const totalRecords = attendanceRecords.length;
    const percentage = totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0;

    return {
      total: students.length,
      presentToday: presentCount,
      absentToday: absentCount,
      percentage
    };
  }, [students, attendanceRecords]);

  const pieData = [
    { name: 'Present', value: stats.presentToday },
    { name: 'Absent', value: stats.absentToday },
    { name: 'Unmarked', value: Math.max(0, stats.total - stats.presentToday - stats.absentToday) }
  ];

  // Get last 7 days for bar chart
  const barData = useMemo(() => {
    const dataMap = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(new Date(today.getTime() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      dataMap[dateStr] = { date: format(parseISO(dateStr), 'MMM dd'), present: 0, absent: 0 };
    }
    
    attendanceRecords.forEach(record => {
      if (dataMap[record.date]) {
        if (record.status === 'Present') dataMap[record.date].present++;
        if (record.status === 'Absent') dataMap[record.date].absent++;
      }
    });

    return Object.values(dataMap);
  }, [attendanceRecords]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of student attendance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.total} icon={Users} description="Registered students" />
        <StatCard title="Present Today" value={stats.presentToday} icon={UserCheck} description="Students present today" />
        <StatCard title="Absent Today" value={stats.absentToday} icon={UserX} description="Students absent today" />
        <StatCard title="Overall Attendance" value={`${stats.percentage}%`} icon={Percent} description="Average attendance" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Attendance Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Today's Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 w-full">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
