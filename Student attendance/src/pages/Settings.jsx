import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Bell, Shield, Database, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const { resetData } = useAttendance();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile settings saved successfully');
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will permanently delete all student and attendance data. Are you absolutely sure?')) {
      resetData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-muted">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-muted">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-muted">
            <Shield className="mr-2 h-4 w-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-muted">
            <Database className="mr-2 h-4 w-4" /> Data Management
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email" type="email" defaultValue={user?.email} />
                </div>
                <Input label="Role" defaultValue="Teacher / Administrator" disabled />
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 border">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm">Reset All Data</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[400px]">
                    This will delete all students, attendance records, and settings. 
                    This action cannot be undone. System will reload with fresh mock data.
                  </p>
                </div>
                <Button variant="danger" onClick={handleResetData} className="shrink-0 gap-2">
                  <Trash2 className="h-4 w-4" /> Factory Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
