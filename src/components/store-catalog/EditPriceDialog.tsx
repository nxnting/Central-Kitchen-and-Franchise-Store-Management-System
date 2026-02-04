import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { StoreCatalog } from '@/types/storeCatalog';

interface EditPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: StoreCatalog | null;
  price: number;
  onPriceChange: (price: number) => void;
  onSave: () => void;
  isPending: boolean;
}

/**
 * Dialog to edit catalog item price
 */
export const EditPriceDialog: React.FC<EditPriceDialogProps> = ({
  open,
  onOpenChange,
  item,
  price,
  onPriceChange,
  onSave,
  isPending
}) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cập nhật giá bán</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">{item.productName}</p>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
          </div>

          <div>
            <Label>Giá bán mới (VNĐ)</Label>
            <Input 
              type="number"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              placeholder="Nhập giá bán"
              min={0}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              className="flex-1" 
              onClick={onSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPriceDialog;
