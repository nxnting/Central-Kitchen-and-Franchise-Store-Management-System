import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Package } from 'lucide-react';
import type { StoreCatalog } from '@/types/storeCatalog';
import { formatDateTime, formatCurrency } from '@/utils/formatters';
import { getProductTypeLabel } from '@/components/common';

interface CatalogViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: StoreCatalog | null;
}

/**
 * Dialog to view catalog item details
 */
export const CatalogViewDialog: React.FC<CatalogViewDialogProps> = ({
  open,
  onOpenChange,
  item
}) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm trong danh mục</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">{item.productName}</p>
              <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Chi nhánh</Label>
              <p className="font-medium">{item.franchiseName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Đơn vị</Label>
              <p className="font-medium">{item.unit}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Loại sản phẩm</Label>
              <p className="font-medium">{getProductTypeLabel(item.productType)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Giá bán</Label>
              <p className="font-semibold text-primary text-lg">{formatCurrency(item.price)}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className={item.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
                {item.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cập nhật lần cuối:</span>
              <span>{formatDateTime(item.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogViewDialog;
