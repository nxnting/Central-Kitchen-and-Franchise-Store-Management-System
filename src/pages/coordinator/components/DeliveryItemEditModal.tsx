import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateDeliveryItem, useDeliveryDetail } from '@/hooks/coordinator/useSupplyQueue';
import { SupplyOrderQueueItemResponse } from '@/types/supply';
import { AlertCircle, Box, FlaskConical } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  order: SupplyOrderQueueItemResponse | null;
}

const DeliveryItemEditModal: React.FC<Props> = ({ open, onClose, order }) => {
  const { data: detail, isLoading: isLoadingDetail } = useDeliveryDetail(order?.deliveryId);
  const updateItemMutation = useUpdateDeliveryItem();
  const [items, setItems] = useState<any[]>([]);
  const [ingredientItems, setIngredientItems] = useState<any[]>([]);

  useEffect(() => {
    if (detail) {
      setItems(detail.productItems.map(i => ({ ...i })));
      setIngredientItems((detail.ingredientItems || []).map(i => ({ ...i })));
    } else if (order) {
      setItems(order.items.map(i => ({ ...i })));
      setIngredientItems((order.ingredientItems || []).map(i => ({ ...i })));
    }
  }, [detail, order]);

  const handleUpdateItem = async (itemId: number, type: 'PRODUCT' | 'INGREDIENT', newQty: number, maxQty: number) => {
    if (!order?.deliveryId) return;
    
    if (newQty < 0) {
      toast.error('Số lượng không thể nhỏ hơn 0');
      return;
    }

    if (newQty > maxQty) {
      toast.error(`Số lượng thực giao (${newQty}) không thể lớn hơn số lượng yêu cầu (${maxQty})`);
      return;
    }

    updateItemMutation.mutate({
      deliveryId: order.deliveryId,
      itemId,
      type,
      data: { quantity: newQty }
    }, {
      onSuccess: () => {
        toast.success(`Đã cập nhật số lượng ${type === 'PRODUCT' ? 'sản phẩm' : 'nguyên liệu'}`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Không thể cập nhật số lượng');
      }
    });
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Điều chỉnh số lượng giao - {order.orderCode}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              Bạn có thể điều chỉnh số lượng thực tế sẽ giao. 
              <strong> Không được giao vượt quá số lượng yêu cầu.</strong> Nếu ít hơn, hệ thống sẽ ghi nhận là giao thiếu.
            </p>
          </div>

          {/* Product Items */}
          {items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Box size={16} /> Sản phẩm
              </h3>
              <div className="border rounded-lg divide-y bg-card">
                {items.map((item) => (
                  <div key={item.productId} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu: {item.quantity} {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 w-32">
                      <Input
                        type="number"
                        className="h-8 text-right"
                        defaultValue={item.forwardedQuantity}
                        min={0}
                        max={item.quantity}
                        onBlur={(e) => {
                           const val = parseFloat(e.target.value);
                           if (!isNaN(val) && val !== item.forwardedQuantity) {
                             handleUpdateItem(item.productId, 'PRODUCT', val, item.quantity);
                           }
                        }}
                      />
                      <span className="text-xs text-muted-foreground w-8">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredient Items */}
          {ingredientItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-blue-700">
                <FlaskConical size={16} /> Nguyên liệu
              </h3>
              <div className="border rounded-lg divide-y bg-blue-50/10">
                {ingredientItems.map((item) => (
                  <div key={item.ingredientId} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.ingredientName}</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu: {item.quantity} {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 w-32">
                      <Input
                        type="number"
                        className="h-8 text-right"
                        defaultValue={item.forwardedQuantity}
                        min={0}
                        max={item.quantity}
                        onBlur={(e) => {
                           const val = parseFloat(e.target.value);
                           if (!isNaN(val) && val !== item.forwardedQuantity) {
                             handleUpdateItem(item.ingredientId, 'INGREDIENT', val, item.quantity);
                           }
                        }}
                      />
                      <span className="text-xs text-muted-foreground w-8">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updateItemMutation.isPending}>Đóng</Button>
          <Button onClick={onClose} className="bg-primary" disabled={updateItemMutation.isPending}>
            {updateItemMutation.isPending ? 'Đang lưu...' : 'Hoàn tất điều chỉnh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryItemEditModal;
