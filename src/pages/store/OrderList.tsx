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
  const storeOrders = mockOrders.filter(o => o.storeName === 'Chi nhánh Quận 1');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    { key: 'id', label: 'Mã đơn' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'deliveryDate', label: 'Ngày giao' },
    { 
      key: 'items', 
      label: 'Số sản phẩm',
      render: (order: Order) => `${order.items.length} sản phẩm`
    },
    { 
      key: 'totalAmount', 
      label: 'Tổng tiền',
      render: (order: Order) => formatCurrency(order.totalAmount)
    },
    { 
      key: 'status', 
      label: 'Trạng thái',
      render: (order: Order) => <StatusBadge status={order.status} />
    },
    {
      key: 'actions',
      label: 'Thao tác',
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
        title="Đơn hàng của tôi" 
        subtitle="Xem và theo dõi đơn hàng từ Bếp Trung tâm"
        action={
          <Button onClick={() => window.location.href = '/store/orders/new'}>
            <ShoppingCart size={16} className="mr-2" />
            Tạo đơn mới
          </Button>
        }
      />

      <DataTable columns={columns} data={storeOrders} />

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Đơn hàng {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày tạo</span>
                <span>{selectedOrder.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày giao</span>
                <span>{selectedOrder.deliveryDate}</span>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Chi tiết sản phẩm</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>{item.productName}</span>
                      <span>{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between font-semibold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Ghi chú: {selectedOrder.notes}</p>
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