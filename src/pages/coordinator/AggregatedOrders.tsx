import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { mockOrders, Order } from '@/data/mockData';
import { Search, Store } from 'lucide-react';

const AggregatedOrders: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const stores = [...new Set(mockOrders.map(o => o.storeName))];
  
  const filteredOrders = mockOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.storeName.toLowerCase().includes(search.toLowerCase());
    const matchesStore = !selectedStore || o.storeName === selectedStore;
    return matchesSearch && matchesStore;
  });

  // Aggregate items across orders
  const aggregatedItems = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      const existing = acc.find(a => a.productId === item.productId);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.orderCount += 1;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          totalQuantity: item.quantity,
          orderCount: 1,
        });
      }
    });
    return acc;
  }, [] as { productId: string; productName: string; unit: string; totalQuantity: number; orderCount: number }[]);

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Aggregated Orders" 
        subtitle="View and aggregate all store orders for production planning"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStore(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedStore ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All Stores
          </button>
          {stores.map(store => (
            <button
              key={store}
              onClick={() => setSelectedStore(store)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStore === store ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {store}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aggregated Demand */}
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Aggregated Demand</h2>
          <div className="space-y-2">
            {aggregatedItems.map(item => (
              <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">From {item.orderCount} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{item.totalQuantity} {item.unit}</p>
                </div>
              </div>
            ))}
            {aggregatedItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No items to aggregate</p>
            )}
          </div>
        </div>

        {/* Individual Orders */}
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Orders ({filteredOrders.length})</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Store size={16} className="text-muted-foreground" />
                    <span className="font-medium">{order.storeName}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{order.id}</span>
                  <span>{order.deliveryDate}</span>
                </div>
                <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.productName} ({item.quantity} {item.unit})
                      {idx < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregatedOrders;
