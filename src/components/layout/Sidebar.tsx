import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, getRoleDisplayName, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  Truck,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChefHat,
  Factory,
  Calendar,
  AlertTriangle,
  BookOpen,
  Store,
  Shield,
  FileText,
  Warehouse,
  User,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const getNavItems = (role: UserRole): NavItem[] => {
  const items: Record<UserRole, NavItem[]> = {
    franchise_store: [
      { label: 'Dashboard', path: '/store', icon: <LayoutDashboard size={20} /> },
      { label: 'Create Order', path: '/store/orders/new', icon: <ShoppingCart size={20} /> },
      { label: 'My Orders', path: '/store/orders', icon: <ClipboardList size={20} /> },
      { label: 'Receive Goods', path: '/store/receive', icon: <Package size={20} /> },
      { label: 'Store Inventory', path: '/store/inventory', icon: <Warehouse size={20} /> },
    ],
    central_kitchen: [
      { label: 'Dashboard', path: '/kitchen', icon: <LayoutDashboard size={20} /> },
      { label: 'Incoming Orders', path: '/kitchen/orders', icon: <ClipboardList size={20} /> },
      { label: 'Production Plan', path: '/kitchen/production', icon: <Factory size={20} /> },
      { label: 'Inventory', path: '/kitchen/inventory', icon: <Warehouse size={20} /> },
      { label: 'Issue Goods', path: '/kitchen/issue', icon: <Package size={20} /> },
    ],
    supply_coordinator: [
      { label: 'Dashboard', path: '/coordinator', icon: <LayoutDashboard size={20} /> },
      { label: 'Aggregated Orders', path: '/coordinator/orders', icon: <ClipboardList size={20} /> },
      { label: 'Coordination', path: '/coordinator/coordination', icon: <Factory size={20} /> },
      { label: 'Delivery Schedule', path: '/coordinator/schedule', icon: <Calendar size={20} /> },
      { label: 'Delivery Tracking', path: '/coordinator/tracking', icon: <Truck size={20} /> },
      { label: 'Exceptions', path: '/coordinator/exceptions', icon: <AlertTriangle size={20} /> },
    ],
    manager: [
      { label: 'Dashboard', path: '/manager', icon: <LayoutDashboard size={20} /> },
      { label: 'Products', path: '/manager/products', icon: <Package size={20} /> },
      { label: 'Recipes & BOM', path: '/manager/recipes', icon: <BookOpen size={20} /> },
      { label: 'Inventory', path: '/manager/inventory', icon: <Warehouse size={20} /> },
      { label: 'Reports', path: '/manager/reports', icon: <BarChart3 size={20} /> },
    ],
    admin: [
      { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
      { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
      { label: 'Roles & Permissions', path: '/admin/roles', icon: <Shield size={20} /> },
      { label: 'Configuration', path: '/admin/config', icon: <Settings size={20} /> },
      { label: 'Stores & Kitchens', path: '/admin/locations', icon: <Store size={20} /> },
      { label: 'System Reports', path: '/admin/reports', icon: <FileText size={20} /> },
    ],
  };

  return items[role] || [];
};

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-accent-foreground">CK Manager</h1>
            <p className="text-xs text-sidebar-foreground">Central Kitchen</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors mb-2"
        >
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {user.displayName}
            </p>
            <p className="text-xs text-sidebar-foreground truncate">
              {getRoleDisplayName(user.role)}
            </p>
          </div>
        </Link>
        <button
          onClick={logout}
          className="nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
