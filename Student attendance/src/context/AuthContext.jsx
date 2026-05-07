import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('attendance_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('attendance_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock Authentication
    if (email && password) {
      const mockUser = { id: 'U1', name: 'Teacher', email, role: 'teacher' };
      setUser(mockUser);
      localStorage.setItem('attendance_user', JSON.stringify(mockUser));
      toast.success('Logged in successfully!');
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    if (name && email && password) {
      const mockUser = { id: `U${Date.now()}`, name, email, role: 'teacher' };
      setUser(mockUser);
      localStorage.setItem('attendance_user', JSON.stringify(mockUser));
      toast.success('Registration successful!');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendance_user');
    toast.success('Logged out!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
