import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockOrders, mockDeliveries, dashboardKPIs } from '@/data/mockData';
import { ClipboardList, Truck, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';

const CoordinatorDashboard: React.FC = () => {
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const scheduledDeliveries = mockDeliveries.filter(d => d.status === 'scheduled').length;
  const inTransitDeliveries = mockDeliveries.filter(d => d.status === 'in_transit').length;
  const delayedDeliveries = mockDeliveries.filter(d => d.status === 'delayed').length;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Coordinator Dashboard" 
        subtitle="Overview of orders, production, and distribution"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Need coordination"
          icon={ClipboardList}
          variant="warning"
        />
        <MetricCard
          title="Scheduled Deliveries"
          value={scheduledDeliveries}
          subtitle="Ready to dispatch"
          icon={Calendar}
          variant="primary"
        />
        <MetricCard
          title="In Transit"
          value={inTransitDeliveries}
          subtitle="Currently delivering"
          icon={Truck}
          variant="success"
        />
        <MetricCard
          title="Exceptions"
          value={delayedDeliveries}
          subtitle="Need attention"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aggregated Orders by Store */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Orders by Store</h2>
            <Link to="/coordinator/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {['Downtown Branch', 'Mall Outlet', 'Airport Terminal', 'University Campus'].map((store) => {
              const storeOrders = mockOrders.filter(o => o.storeName === store);
              const pending = storeOrders.filter(o => o.status === 'pending').length;
              const processing = storeOrders.filter(o => o.status === 'processing').length;
              
              return (
                <div key={store} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{store}</p>
                    <p className="text-sm text-muted-foreground">{storeOrders.length} total orders</p>
                  </div>
                  <div className="flex gap-2">
                    {pending > 0 && (
                      <span className="status-badge status-pending">{pending} pending</span>
                    )}
                    {processing > 0 && (
                      <span className="status-badge status-processing">{processing} processing</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Deliveries</h2>
            <Link to="/coordinator/schedule" className="text-sm text-primary hover:underline flex items-center gap-1">
              View schedule <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockDeliveries.filter(d => d.status === 'scheduled').map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{delivery.storeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {delivery.scheduledDate} at {delivery.scheduledTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{delivery.driver}</p>
                  <p className="text-xs text-muted-foreground">{delivery.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-3xl font-semibold text-foreground">{dashboardKPIs.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg text-center">
              <p className="text-3xl font-semibold text-success">{dashboardKPIs.deliveredOrders}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg text-center">
              <p className="text-3xl font-semibold text-warning">{dashboardKPIs.pendingOrders}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <p className="text-3xl font-semibold text-destructive">{dashboardKPIs.cancelledOrders}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
