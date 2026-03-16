import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username) {
      setUser({
        id: 0,
        username,
        email: '',
        fullName: username,
        role: role || 'STUDENT'
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string, role?: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    if (userData.username) localStorage.setItem('username', userData.username);
    if (role ?? userData.role) localStorage.setItem('role', role ?? userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}