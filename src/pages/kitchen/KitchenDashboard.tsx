import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockOrders, mockProductionPlans, mockInventory } from '@/data/mockData';
import { ClipboardList, Factory, Package, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

const KitchenDashboard: React.FC = () => {
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const processingOrders = mockOrders.filter(o => o.status === 'processing').length;
  const inProgressProduction = mockProductionPlans.filter(p => p.status === 'in_progress').length;
  const expiringItems = mockInventory.filter(i => {
    const expiry = new Date(i.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }).length;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Kitchen Dashboard" 
        subtitle="Central Kitchen operations overview"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting processing"
          icon={ClipboardList}
          variant="warning"
        />
        <MetricCard
          title="In Production"
          value={inProgressProduction}
          subtitle="Currently being made"
          icon={Factory}
          variant="primary"
        />
        <MetricCard
          title="Ready to Issue"
          value={processingOrders}
          subtitle="Processed orders"
          icon={Package}
          variant="success"
        />
        <MetricCard
          title="Expiring Soon"
          value={expiringItems}
          subtitle="Within 7 days"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Orders */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Incoming Orders</h2>
            <Link to="/kitchen/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.storeName}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="text-sm text-muted-foreground mt-1">{order.items.length} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Status */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Production</h2>
            <Link to="/kitchen/production" className="text-sm text-primary hover:underline flex items-center gap-1">
              View plan <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockProductionPlans.slice(0, 4).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    plan.status === 'completed' ? 'bg-success' : 
                    plan.status === 'in_progress' ? 'bg-info' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <p className="font-medium">{plan.productName}</p>
                    <p className="text-sm text-muted-foreground">{plan.assignedTo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{plan.quantity} {plan.unit}</p>
                  <StatusBadge status={plan.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Inventory */}
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={20} className="text-warning" />
              Expiring Soon (FEFO Priority)
            </h2>
            <Link to="/kitchen/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
              View inventory <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockInventory.slice(0, 6).map((item) => (
              <div key={item.id} className="p-3 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{item.productName}</p>
                  <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded">
                    {item.expiryDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Batch: {item.batchNumber}</span>
                  <span>{item.quantity} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
