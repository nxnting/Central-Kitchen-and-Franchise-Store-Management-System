import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockOrders, mockProducts } from '@/data/mockData';
import { ShoppingCart, Package, ClipboardList, AlertTriangle, ArrowRight } from 'lucide-react';

const StoreDashboard: React.FC = () => {
  const storeOrders = mockOrders.filter(o => o.storeName === 'Downtown Branch');
  const pendingOrders = storeOrders.filter(o => o.status === 'pending').length;
  const processingOrders = storeOrders.filter(o => o.status === 'processing').length;
  const lowStockItems = mockProducts.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Store Dashboard" 
        subtitle="Downtown Branch - Overview of your store operations"
        action={{
          label: 'New Order',
          icon: ShoppingCart,
          onClick: () => window.location.href = '/store/orders/new'
        }}
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
          title="Processing"
          value={processingOrders}
          subtitle="Being prepared"
          icon={Package}
          variant="primary"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems}
          subtitle="Need reordering"
          icon={AlertTriangle}
          variant="danger"
        />
        <MetricCard
          title="Total Orders (MTD)"
          value={12}
          subtitle="This month"
          icon={ShoppingCart}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/store/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {storeOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="text-sm text-muted-foreground mt-1">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Inventory Alerts</h2>
            <Link to="/store/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
              View inventory <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockProducts.filter(p => p.stock <= p.minStock * 1.5).slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${product.stock <= product.minStock ? 'text-destructive' : 'text-warning'}`}>
                    {product.stock} {product.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
