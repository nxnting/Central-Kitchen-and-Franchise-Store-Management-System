import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockUsers, mockStores, dashboardKPIs } from '@/data/mockData';
import { Users, Store, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const userColumns = [
    { key: 'displayName', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', render: (u: typeof mockUsers[0]) => <StatusBadge status={u.status} /> },
    { key: 'lastLogin', label: 'Last Login' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Admin Dashboard" subtitle="System administration and configuration" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Users" value={mockUsers.length} subtitle="Active accounts" icon={Users} variant="primary" />
        <MetricCard title="Active Stores" value={mockStores.filter(s => s.status === 'active').length} subtitle="Operational" icon={Store} variant="success" />
        <MetricCard title="System Uptime" value="99.9%" subtitle="Last 30 days" icon={Settings} variant="default" />
        <MetricCard title="Active Roles" value="5" subtitle="Configured" icon={Shield} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <DataTable columns={userColumns} data={mockUsers.slice(0, 5)} />
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add User', icon: Users, path: '/admin/users' },
              { label: 'Manage Roles', icon: Shield, path: '/admin/roles' },
              { label: 'System Config', icon: Settings, path: '/admin/config' },
              { label: 'View Stores', icon: Store, path: '/admin/locations' },
            ].map((action) => (
              <Link key={action.label} to={action.path} className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <action.icon size={20} className="text-primary" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
