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
    { key: 'displayName', label: 'Tên' },
    { key: 'role', label: 'Vai trò' },
    { key: 'status', label: 'Trạng thái', render: (u: typeof mockUsers[0]) => <StatusBadge status={u.status} /> },
    { key: 'lastLogin', label: 'Đăng nhập lần cuối' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Trang chủ Quản trị" subtitle="Quản trị và cấu hình hệ thống" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Tổng người dùng" value={mockUsers.length} subtitle="Tài khoản hoạt động" icon={Users} variant="primary" />
        <MetricCard title="Cửa hàng hoạt động" value={mockStores.filter(s => s.status === 'active').length} subtitle="Đang vận hành" icon={Store} variant="success" />
        <MetricCard title="Uptime hệ thống" value="99.9%" subtitle="30 ngày qua" icon={Settings} variant="default" />
        <MetricCard title="Vai trò" value="5" subtitle="Đã cấu hình" icon={Shield} variant="default" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Người dùng gần đây</h2>
            <Link to="/admin/users" className="text-sm text-primary hover:underline">Xem tất cả →</Link>
          </div>
          <DataTable columns={userColumns} data={mockUsers.slice(0, 5)} />
        </div>
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Thao tác nhanh</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Thêm người dùng', icon: Users, path: '/admin/users' },
              { label: 'Phân quyền', icon: Shield, path: '/admin/roles' },
              { label: 'Cấu hình', icon: Settings, path: '/admin/config' },
              { label: 'Cửa hàng', icon: Store, path: '/admin/locations' },
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