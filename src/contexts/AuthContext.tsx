import React, { createContext, useContext, useState, useEffect } from 'react';

import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; userType?: 'admin' | 'user' }>;
  register: (userData: Omit<User, 'id' | 'coins' | 'userType' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addCoins: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize admin users if not exists
    const adminUsers = localStorage.getItem('adminUsers');
    if (!adminUsers) {
      const defaultAdmins = [
        {
          id: 'admin1',
          username: 'admin',
          password: 'Admin@123',
          realname: 'System Administrator',
          email: 'ad@admin.com',
          language: 'English',
          school: 'Admin School',
          standard: 'Admin',
          board: 'Admin',
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          coins: 10000,
          userType: 'admin' as const,
          createdAt: new Date()
        },
        {
          id: 'admin2',
          username: 'superadmin',
          password: 'Super@123',
          realname: 'Super Administrator',
          email: 'su@admin.com',
          language: 'English',
          school: 'Admin School',
          standard: 'Admin',
          board: 'Admin',
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          coins: 10000,
          userType: 'admin' as const,
          createdAt: new Date()
        }
      ];
      localStorage.setItem('adminUsers', JSON.stringify(defaultAdmins));
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; userType?: 'admin' | 'user' }> => {
    // Simulate API call
    
    // Check admin users
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const adminUser = adminUsers.find((admin: User) => 
      admin.username === username && admin.password === password
    );
    
    if (adminUser) {
      const updatedAdmin = { ...adminUser, lastLogin: new Date() };
      setUser(updatedAdmin);
      localStorage.setItem('user', JSON.stringify(updatedAdmin));
      return { success: true, userType: 'admin' };
    }
    
    // Check regular users
    const regularUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]');
    const regularUser = regularUsers.find((user: User) => 
      user.username === username && user.password === password
    );
    
    if (regularUser) {
      const updatedUser = { ...regularUser, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, userType: 'user' };
    }
    
    return { success: false };
  };

  const register = async (userData: Omit<User, 'id' | 'coins' | 'userType' | 'createdAt'>): Promise<boolean> => {
    // Simulate API call
    
    // Check if username already exists
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const regularUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]');
    const allUsers = [...adminUsers, ...regularUsers];
    
    if (allUsers.some((user: User) => user.username === userData.username)) {
      return false; // Username already exists
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      coins: 100, // Starting coins
      userType: 'user',
      createdAt: new Date()
    };
    
    // Save to regular users
    const updatedUsers = [...regularUsers, newUser];
    localStorage.setItem('regularUsers', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addCoins = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, coins: user.coins + amount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, addCoins }}>
      {children}
    </AuthContext.Provider>
  );
};