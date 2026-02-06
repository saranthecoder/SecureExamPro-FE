import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/types/exam';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'student') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User> = {
  'admin@secureexam.com': { id: 'a1', name: 'Dr. Admin', email: 'admin@secureexam.com', role: 'admin' },
  'student@secureexam.com': { id: 's1', name: 'Alice Johnson', email: 'student@secureexam.com', role: 'student' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: 'admin' | 'student') => {
    // Mock login — accepts any credentials
    const mockUser = mockUsers[email] || {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
    };
    if (mockUser.role !== role) mockUser.role = role;
    setUser(mockUser);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
