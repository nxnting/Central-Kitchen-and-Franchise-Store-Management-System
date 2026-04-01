import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapApiRoleToUserRole = (role: string): UserRole => {
  const normalizedRole = role.toLowerCase();
  const roleMap: Record<string, UserRole> = {
    'admin': 'admin',
    'storestaff': 'franchise_store',
    'kitchenstaff': 'central_kitchen',
    'supplycoordinator': 'supply_coordinator',
    'manager': 'manager',
  };
  return roleMap[normalizedRole] || 'admin';
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (token && username && role) {
      setUser({
        id: userId || '0',
        username: username,
        role: mapApiRoleToUserRole(role),
        displayName: username,
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('accessToken');
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');

      if (token && username && role) {
        setUser({
          id: userId || '0',
          username: username,
          role: mapApiRoleToUserRole(role),
          displayName: username,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-login', handleAuthChange);
    window.addEventListener('auth-logout', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-login', handleAuthChange);
      window.removeEventListener('auth-logout', handleAuthChange);
    };
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, logout, isAuthenticated: !!user, isLoading }}>
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
    franchise_store: 'Nhân viên Cửa hàng',
    central_kitchen: 'Nhân viên Bếp Trung tâm',
    supply_coordinator: 'Điều phối Cung ứng',
    manager: 'Quản lý Vận hành',
    admin: 'Quản trị Hệ thống',
  };
  return names[role];
};