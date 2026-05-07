import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const DEPARTMENTS = ["Computer Engineering", "Information Technology", "Electronics", "Mechanical"];
const CLASSES = ["First Year", "Second Year", "Third Year", "Final Year"];

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    rollNumber: student?.rollNumber || '',
    email: student?.email || '',
    department: student?.department || DEPARTMENTS[0],
    className: student?.className || CLASSES[0],
    division: student?.division || 'A',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Roll Number"
          value={formData.rollNumber}
          onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Department</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
          >
            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Class</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={formData.className}
            onChange={e => setFormData({ ...formData, className: e.target.value })}
          >
            {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Division</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={formData.division}
            onChange={e => setFormData({ ...formData, division: e.target.value })}
          >
            {['A', 'B', 'C'].map(div => <option key={div} value={div}>{div}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Student</Button>
      </div>
    </form>
  );
};

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = filterClass ? student.className === filterClass : true;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, filterClass]);

  const handleAddEdit = (data) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
    } else {
      addStudent(data);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student? All attendance records will also be deleted.")) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student directory ({filteredStudents.length} total)</p>
        </div>
        <Button onClick={openAddModal} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search students by name or roll number..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Class/Div</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar || `https://i.pravatar.cc/150?u=${student.id}`} alt={student.name} className="w-8 h-8 rounded-full bg-primary/20" />
                          <div>
                            <div className="font-medium text-foreground">{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{student.rollNumber}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {student.className} - {student.division}
                        </span>
                      </td>
                      <td className="px-4 py-3">{student.department}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(student)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student" : "Add New Student"}
      >
        <StudentForm 
          student={editingStudent} 
          onSubmit={handleAddEdit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default Students;
