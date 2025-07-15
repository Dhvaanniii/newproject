import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  realname: string;
  email: string;
  language: string;
  school: string;
  standard: string;
  board: string;
  country: string;
  state: string;
  city: string;
  coins: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'coins' | 'isAdmin'>) => Promise<boolean>;
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
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (username === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: '1',
        username: 'admin',
        realname: 'Administrator',
        email: 'admin@puzzlegame.com',
        language: 'English',
        school: 'Admin School',
        standard: 'Admin',
        board: 'Admin Board',
        country: 'USA',
        state: 'California',
        city: 'San Francisco',
        coins: 1000,
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    } else if (username === 'user' && password === 'user') {
      const regularUser: User = {
        id: '2',
        username: 'user',
        realname: 'Test User',
        email: 'user@puzzlegame.com',
        language: 'English',
        school: 'Test School',
        standard: '5th Grade',
        board: 'CBSE',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        coins: 50,
        isAdmin: false,
      };
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'coins' | 'isAdmin'>): Promise<boolean> => {
    // Simulate API call
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      coins: 100, // Starting coins
      isAdmin: false,
    };
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