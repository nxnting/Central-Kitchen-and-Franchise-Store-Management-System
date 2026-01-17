import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockOrders, Order } from '@/data/mockData';
import { Play, Check, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const IncomingOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(mockOrders);

  const handleProcessOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'processing' as const } : o
    ));
    toast.success(`Order ${orderId} is now being processed`);
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'delivered' as const } : o
    ));
    toast.success(`Order ${orderId} completed and ready for delivery`);
  };

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'storeName', label: 'Store' },
    { key: 'createdAt', label: 'Created' },
    { key: 'deliveryDate', label: 'Delivery Date' },
    { 
      key: 'items', 
      label: 'Items',
      render: (order: Order) => `${order.items.length} items`
    },
    { 
      key: 'totalAmount', 
      label: 'Total',
      render: (order: Order) => `$${order.totalAmount.toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (order: Order) => <StatusBadge status={order.status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: Order) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
            <Eye size={16} />
          </Button>
          {order.status === 'pending' && (
            <Button size="sm" onClick={() => handleProcessOrder(order.id)}>
              <Play size={16} className="mr-1" />
              Process
            </Button>
          )}
          {order.status === 'processing' && (
            <Button size="sm" variant="outline" onClick={() => handleCompleteOrder(order.id)}>
              <Check size={16} className="mr-1" />
              Complete
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Incoming Orders" 
        subtitle="Process orders from franchise stores"
      />

      <DataTable columns={columns} data={orders} />

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Store</p>
                  <p className="font-medium">{selectedOrder.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{selectedOrder.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p>{selectedOrder.deliveryDate}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{item.productName}</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between font-semibold">
                <span>Total Value</span>
                <span>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncomingOrders;
