import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'franchise_store' | 'central_kitchen' | 'supply_coordinator' | 'manager' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
  storeName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded demo accounts
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  store1: {
    password: '123456',
    user: {
      id: '1',
      username: 'store1',
      role: 'franchise_store',
      displayName: 'John Smith',
      storeName: 'Downtown Branch',
    },
  },
  kitchen1: {
    password: '123456',
    user: {
      id: '2',
      username: 'kitchen1',
      role: 'central_kitchen',
      displayName: 'Maria Garcia',
    },
  },
  supply1: {
    password: '123456',
    user: {
      id: '3',
      username: 'supply1',
      role: 'supply_coordinator',
      displayName: 'David Chen',
    },
  },
  manager1: {
    password: '123456',
    user: {
      id: '4',
      username: 'manager1',
      role: 'manager',
      displayName: 'Sarah Johnson',
    },
  },
  admin1: {
    password: '123456',
    user: {
      id: '5',
      username: 'admin1',
      role: 'admin',
      displayName: 'Admin User',
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS[username];
    if (account && account.password === password) {
      setUser(account.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getRoleDashboardPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    franchise_store: '/store',
    central_kitchen: '/kitchen',
    supply_coordinator: '/coordinator',
    manager: '/manager',
    admin: '/admin',
  };
  return paths[role];
};

export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    franchise_store: 'Franchise Store Staff',
    central_kitchen: 'Central Kitchen Staff',
    supply_coordinator: 'Supply Coordinator',
    manager: 'Manager',
    admin: 'Admin',
  };
  return names[role];
};
