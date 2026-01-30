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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map role từ API sang UserRole
const mapApiRoleToUserRole = (role: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'Admin': 'admin',
    'FranchiseStore': 'franchise_store',
    'CentralKitchen': 'central_kitchen',
    'SupplyCoordinator': 'supply_coordinator',
    'Manager': 'manager',
  };
  return roleMap[role] || 'admin';
};

// Tài khoản demo (fallback)
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  store1: {
    password: '123456',
    user: {
      id: '1',
      username: 'store1',
      role: 'franchise_store',
      displayName: 'Nguyễn Văn An',
      storeName: 'Chi nhánh Quận 1',
    },
  },
  kitchen1: {
    password: '123456',
    user: {
      id: '2',
      username: 'kitchen1',
      role: 'central_kitchen',
      displayName: 'Trần Thị Bình',
    },
  },
  supply1: {
    password: '123456',
    user: {
      id: '3',
      username: 'supply1',
      role: 'supply_coordinator',
      displayName: 'Lê Văn Cường',
    },
  },
  manager1: {
    password: '123456',
    user: {
      id: '4',
      username: 'manager1',
      role: 'manager',
      displayName: 'Phạm Thị Dung',
    },
  },
  admin1: {
    password: '123456',
    user: {
      id: '5',
      username: 'admin1',
      role: 'admin',
      displayName: 'Quản Trị Viên',
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage khi mount để restore session từ API login
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
  }, []);

  // Listen for storage changes (khi login từ API)
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

    // Listen cho cả storage event (cross-tab) và custom event (same-tab)
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-login', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-login', handleAuthChange);
    };
  }, []);

  const login = (username: string, password: string): boolean => {
    // Demo login (fallback khi không dùng API)
    const account = DEMO_ACCOUNTS[username];
    if (account && account.password === password) {
      setUser(account.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
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
    franchise_store: 'Nhân viên Cửa hàng',
    central_kitchen: 'Nhân viên Bếp Trung tâm',
    supply_coordinator: 'Điều phối Cung ứng',
    manager: 'Quản lý Vận hành',
    admin: 'Quản trị Hệ thống',
  };
  return names[role];
};