import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="font-semibold md:hidden">Attendance Pro</div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-2">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium leading-none">{user?.name}</span>
            <span className="text-xs text-muted-foreground mt-1">{user?.role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
