import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  Download,
  TrendingUp,
  Users,
  Package,
  Truck,
  Calendar,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const SystemReports: React.FC = () => {
  // Mock data
  const monthlyOrders = [
    { month: 'T1', orders: 450, delivered: 435 },
    { month: 'T2', orders: 520, delivered: 510 },
    { month: 'T3', orders: 480, delivered: 465 },
    { month: 'T4', orders: 600, delivered: 590 },
    { month: 'T5', orders: 550, delivered: 540 },
    { month: 'T6', orders: 680, delivered: 670 },
  ];

  const storePerformance = [
    { name: 'Q1 Nguyễn Huệ', orders: 156, revenue: 45000000 },
    { name: 'Q3 Võ Văn Tần', orders: 134, revenue: 38000000 },
    { name: 'Q7 Phú Mỹ Hưng', orders: 178, revenue: 52000000 },
    { name: 'Thủ Đức', orders: 112, revenue: 32000000 },
    { name: 'Bình Thạnh', orders: 145, revenue: 41000000 },
  ];

  const dailyActivity = [
    { day: 'T2', users: 45, orders: 78 },
    { day: 'T3', users: 52, orders: 85 },
    { day: 'T4', users: 48, orders: 72 },
    { day: 'T5', users: 56, orders: 92 },
    { day: 'T6', users: 62, orders: 98 },
    { day: 'T7', users: 38, orders: 65 },
    { day: 'CN', users: 25, orders: 42 },
  ];

  const reports = [
    { id: 1, name: 'Báo cáo Đơn hàng Tháng 6/2024', type: 'Đơn hàng', date: '01/07/2024', size: '2.4 MB' },
    { id: 2, name: 'Báo cáo Sản xuất Q2/2024', type: 'Sản xuất', date: '01/07/2024', size: '3.1 MB' },
    { id: 3, name: 'Báo cáo Tồn kho Tháng 6/2024', type: 'Tồn kho', date: '30/06/2024', size: '1.8 MB' },
    { id: 4, name: 'Báo cáo Chi phí Q2/2024', type: 'Tài chính', date: '01/07/2024', size: '4.2 MB' },
    { id: 5, name: 'Báo cáo Hiệu suất Cửa hàng', type: 'Hiệu suất', date: '28/06/2024', size: '2.8 MB' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Báo cáo Tổng hợp" 
        subtitle="Xem báo cáo và thống kê toàn hệ thống"
        action={
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Xuất tất cả
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </div>
          <p className="text-2xl font-bold">3,280</p>
          <p className="text-sm text-success flex items-center gap-1 mt-1">
            <TrendingUp size={14} />
            +18% so với kỳ trước
          </p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Giao thành công</p>
          </div>
          <p className="text-2xl font-bold">3,210</p>
          <p className="text-sm text-muted-foreground mt-1">Tỷ lệ: 97.8%</p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Người dùng</p>
          </div>
          <p className="text-2xl font-bold">47</p>
          <p className="text-sm text-muted-foreground mt-1">Hoạt động: 42</p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
          </div>
          <p className="text-2xl font-bold">Hôm nay</p>
          <p className="text-sm text-muted-foreground mt-1">10:30 AM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Orders */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Đơn hàng theo Tháng</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="orders" name="Tổng đơn" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" name="Giao thành công" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hoạt động theo Ngày</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="users" name="Người dùng" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.2)" />
                <Area type="monotone" dataKey="orders" name="Đơn hàng" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Store Performance */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hiệu suất Cửa hàng</h3>
          </div>
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-1" />
            Xuất
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Cửa hàng</th>
                <th className="text-right p-3 font-medium">Số đơn</th>
                <th className="text-right p-3 font-medium">Doanh thu (ước tính)</th>
                <th className="text-center p-3 font-medium">Hiệu suất</th>
              </tr>
            </thead>
            <tbody>
              {storePerformance.map((store, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-3 font-medium">{store.name}</td>
                  <td className="p-3 text-right">{store.orders}</td>
                  <td className="p-3 text-right">{store.revenue.toLocaleString('vi-VN')}đ</td>
                  <td className="p-3 text-center">
                    <div className="w-full bg-muted rounded-full h-2 max-w-[100px] mx-auto">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(store.orders / 180) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Báo cáo Gần đây</h3>
        </div>
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
