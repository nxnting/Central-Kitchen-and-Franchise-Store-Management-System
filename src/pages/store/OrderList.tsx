import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockOrders, Order } from '@/data/mockData';
import { ShoppingCart, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const OrderList: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const storeOrders = mockOrders.filter(o => o.storeName === 'Downtown Branch');

  const columns = [
    { key: 'id', label: 'Order ID' },
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
        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
          <Eye size={16} />
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="My Orders" 
        subtitle="View and track your orders from Central Kitchen"
        action={{
          label: 'New Order',
          icon: ShoppingCart,
          onClick: () => window.location.href = '/store/orders/new'
        }}
      />

      <DataTable columns={columns} data={storeOrders} />

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{selectedOrder.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Date</span>
                <span>{selectedOrder.deliveryDate}</span>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>{item.productName}</span>
                      <span>{item.quantity} {item.unit} × ${item.unitPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes: {selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
