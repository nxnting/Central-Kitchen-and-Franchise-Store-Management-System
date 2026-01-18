import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { 
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line } from 'recharts';

const Reports: React.FC = () => {
  // Mock data for reports
  const wastageData = [
    { name: 'Trân châu', wastage: 45, cost: 225000 },
    { name: 'Sữa tươi', wastage: 30, cost: 180000 },
    { name: 'Trà ô long', wastage: 20, cost: 100000 },
    { name: 'Kem cheese', wastage: 15, cost: 120000 },
    { name: 'Đường nâu', wastage: 10, cost: 50000 },
  ];

  const costBreakdown = [
    { name: 'Nguyên liệu', value: 45, color: '#16a34a' },
    { name: 'Nhân công', value: 25, color: '#2563eb' },
    { name: 'Vận chuyển', value: 15, color: '#f59e0b' },
    { name: 'Hao hụt', value: 10, color: '#ef4444' },
    { name: 'Khác', value: 5, color: '#8b5cf6' },
  ];

  const monthlyPerformance = [
    { month: 'T1', production: 1200, target: 1000, efficiency: 92 },
    { month: 'T2', production: 1350, target: 1200, efficiency: 94 },
    { month: 'T3', production: 1100, target: 1300, efficiency: 88 },
    { month: 'T4', production: 1500, target: 1400, efficiency: 96 },
    { month: 'T5', production: 1400, target: 1500, efficiency: 93 },
    { month: 'T6', production: 1600, target: 1600, efficiency: 97 },
  ];

  const storePerformance = [
    { store: 'Q1 Nguyễn Huệ', orders: 156, onTime: 148, rate: 95 },
    { store: 'Q3 Võ Văn Tần', orders: 134, onTime: 125, rate: 93 },
    { store: 'Q7 Phú Mỹ Hưng', orders: 178, onTime: 165, rate: 93 },
    { store: 'Thủ Đức', orders: 112, onTime: 100, rate: 89 },
    { store: 'Bình Thạnh', orders: 145, onTime: 138, rate: 95 },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Báo cáo & Phân tích" 
        subtitle="Báo cáo hao hụt, chi phí và hiệu suất vận hành"
        action={
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Xuất báo cáo
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Tổng hao hụt tháng</p>
          </div>
          <p className="text-2xl font-bold">675,000đ</p>
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <TrendingUp size={14} />
            +12% so với tháng trước
          </p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Chi phí sản xuất</p>
          </div>
          <p className="text-2xl font-bold">45.2M đ</p>
          <p className="text-sm text-success flex items-center gap-1 mt-1">
            <TrendingDown size={14} />
            -5% so với tháng trước
          </p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Hiệu suất sản xuất</p>
          </div>
          <p className="text-2xl font-bold">94.5%</p>
          <p className="text-sm text-success flex items-center gap-1 mt-1">
            <TrendingUp size={14} />
            +3% so với tháng trước
          </p>
        </div>
        
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Tỷ lệ giao đúng hạn</p>
          </div>
          <p className="text-2xl font-bold">93.2%</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            Ổn định
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Wastage Report */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold">Báo cáo Hao hụt Nguyên liệu</h3>
            </div>
            <Button variant="ghost" size="sm">
              <FileText size={14} className="mr-1" />
              Chi tiết
            </Button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wastageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  formatter={(value: number) => [`${value} kg`, 'Hao hụt']}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="wastage" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left pb-2">Nguyên liệu</th>
                  <th className="text-right pb-2">Số lượng</th>
                  <th className="text-right pb-2">Chi phí</th>
                </tr>
              </thead>
              <tbody>
                {wastageData.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right">{item.wastage} kg</td>
                    <td className="py-2 text-right text-destructive">{item.cost.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Phân bổ Chi phí</h3>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Tỷ lệ']} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {costBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Hiệu suất Sản xuất theo Tháng</h3>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Bar yAxisId="left" dataKey="production" fill="hsl(var(--primary))" name="Sản xuất" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="target" fill="hsl(var(--muted))" name="Mục tiêu" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="hsl(var(--success))" name="Hiệu suất %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Store Performance */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Hiệu suất Giao hàng theo Cửa hàng</h3>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Cửa hàng</th>
              <th className="text-right p-3 font-medium">Tổng đơn</th>
              <th className="text-right p-3 font-medium">Đúng hạn</th>
              <th className="text-right p-3 font-medium">Tỷ lệ</th>
              <th className="text-center p-3 font-medium">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {storePerformance.map((store, idx) => (
              <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-3 font-medium">{store.store}</td>
                <td className="p-3 text-right">{store.orders}</td>
                <td className="p-3 text-right">{store.onTime}</td>
                <td className="p-3 text-right">{store.rate}%</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    store.rate >= 95 ? 'bg-success/10 text-success' :
                    store.rate >= 90 ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {store.rate >= 95 ? 'Xuất sắc' : store.rate >= 90 ? 'Tốt' : 'Cần cải thiện'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
