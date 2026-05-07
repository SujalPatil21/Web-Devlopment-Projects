import { subDays, format } from "date-fns";

export const generateMockData = () => {
  const students = [
    { name: "Sujal Patil", rollNumber: "25SC153" },
    { name: "Sibtain Raza", rollNumber: "25SC125" },
    { name: "Arsalan Inamdar", rollNumber: "25SC123" },
    { name: "Siddhi Kumawat", rollNumber: "25SC158" },
    { name: "Srushti Kanidale", rollNumber: "25SC146" }
  ].map((s, index) => {
    const firstName = s.name.split(' ')[0];
    const lastName = s.name.split(' ')[1] || '';
    return {
      id: `STU${1000 + index}`,
      name: s.name,
      rollNumber: s.rollNumber,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
      gender: "Not Specified",
      department: "Computer Engineering",
      className: "Second Year", // Maps to class
      division: "A",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`,
      createdAt: new Date().toISOString()
    };
  });

  const attendanceRecords = [];
  const today = new Date();

  // Generate Attendance for the last 30 days
  for (let i = 0; i < 30; i++) {
    const currentDate = subDays(today, i);
    // Skip Sundays
    if (currentDate.getDay() === 0) continue;
    
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    students.forEach(student => {
      // 75-95% attendance logic
      // Give each student a slightly different base percentage target between 75% and 95%
      const targetPercent = 0.75 + (Math.random() * 0.20); // 75% to 95%
      const rand = Math.random();
      let status = 'Present';
      
      // We want roughly `targetPercent` to be present.
      if (rand > targetPercent) {
        // If they miss, make them absent most of the time, sometimes late
        status = Math.random() > 0.3 ? 'Absent' : 'Late';
      }

      attendanceRecords.push({
        id: `ATT${Math.random().toString(36).substr(2, 9)}`,
        studentId: student.id,
        date: dateStr,
        status,
        markedBy: 'system',
        timestamp: new Date().toISOString()
      });
    });
  }

  return { students, attendanceRecords };
};
