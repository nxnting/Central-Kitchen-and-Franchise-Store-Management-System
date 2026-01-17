import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockOrders, mockInventory, Order } from '@/data/mockData';
import { Package, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const IssueGoods: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  // Orders ready to be issued (processing status)
  const readyOrders = mockOrders.filter(o => o.status === 'processing');

  const handleIssueGoods = () => {
    if (selectedOrder && checkedItems.length === selectedOrder.items.length) {
      toast.success(`Goods issued for order ${selectedOrder.id}`);
      setSelectedOrder(null);
      setCheckedItems([]);
    } else {
      toast.error('Please verify all items before issuing');
    }
  };

  const toggleItem = (productId: string) => {
    if (checkedItems.includes(productId)) {
      setCheckedItems(checkedItems.filter(id => id !== productId));
    } else {
      setCheckedItems([...checkedItems, productId]);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Issue Goods" 
        subtitle="Issue processed goods from inventory to orders"
      />

      {readyOrders.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Orders Ready</h3>
          <p className="text-muted-foreground">No processed orders are waiting to be issued.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readyOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store</span>
                  <span className="font-medium">{order.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Date</span>
                  <span>{order.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{order.items.length} items</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    • {item.productName} ({item.quantity} {item.unit})
                  </p>
                ))}
                {order.items.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedOrder(order);
                  setCheckedItems([]);
                }}
              >
                <Package size={16} className="mr-2" />
                Issue Goods
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Issue Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Goods - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{selectedOrder.storeName}</p>
              </div>

              <div>
                <p className="font-medium mb-3">Verify Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => {
                    const inventoryItem = mockInventory.find(i => i.productName === item.productName);
                    const hasStock = inventoryItem && inventoryItem.quantity >= item.quantity;
                    
                    return (
                      <div key={item.productId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Checkbox
                          id={item.productId}
                          checked={checkedItems.includes(item.productId)}
                          onCheckedChange={() => toggleItem(item.productId)}
                          disabled={!hasStock}
                        />
                        <Label htmlFor={item.productId} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{item.productName}</span>
                            <span className="text-sm">{item.quantity} {item.unit}</span>
                          </div>
                          {!hasStock && (
                            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                              <AlertTriangle size={12} />
                              Insufficient stock
                            </div>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleIssueGoods}
                  disabled={checkedItems.length !== selectedOrder.items.length}
                >
                  <Check size={16} className="mr-2" />
                  Confirm Issue
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueGoods;
