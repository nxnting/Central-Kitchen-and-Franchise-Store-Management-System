import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { dashboardKPIs, productionChartData, storePerformanceData } from '@/data/mockData';
import { DollarSign, TrendingUp, Package, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ManagerDashboard: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Manager Dashboard" subtitle="Business performance and analytics" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Revenue" value={`$${dashboardKPIs.totalRevenue.toLocaleString()}`} subtitle="This month" icon={DollarSign} variant="success" trend={{ value: 12, isPositive: true }} />
        <MetricCard title="Production Efficiency" value={`${dashboardKPIs.productionEfficiency}%`} subtitle="Target: 95%" icon={TrendingUp} variant="primary" />
        <MetricCard title="Inventory Value" value={`$${dashboardKPIs.inventoryValue.toLocaleString()}`} subtitle="Current stock" icon={Package} variant="default" />
        <MetricCard title="Active Stores" value={dashboardKPIs.activeStores} subtitle="Operational" icon={BarChart3} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Production vs Target</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="produced" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Store Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={storePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
