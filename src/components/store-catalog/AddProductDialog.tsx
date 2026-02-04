import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search, X, Loader2 } from 'lucide-react';
import type { Product } from '@/types/product';
import { getProductTypeLabel } from '@/components/common';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  price: number;
  onPriceChange: (price: number) => void;
  onAssign: () => void;
  isPending: boolean;
  isLoadingProducts: boolean;
  availableProducts: Product[];
}

/**
 * Dialog to add/assign product to catalog
 */
export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  searchTerm,
  onSearchChange,
  selectedProduct,
  onSelectProduct,
  price,
  onPriceChange,
  onAssign,
  isPending,
  isLoadingProducts,
  availableProducts
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm vào danh mục</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Products */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Product */}
          {selectedProduct && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-primary" />
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {selectedProduct.sku} | {selectedProduct.unit}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onSelectProduct(null)}>
                <X size={16} />
              </Button>
            </div>
          )}

          {/* Product List */}
          {!selectedProduct && (
            <div className="max-h-[200px] overflow-y-auto border rounded-lg">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Không có sản phẩm khả dụng</p>
                </div>
              ) : (
                availableProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => onSelectProduct(product)}
                  >
                    <Package size={18} className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {product.sku} | {product.unit} | {getProductTypeLabel(product.productType)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Price Input */}
          {selectedProduct && (
            <div>
              <Label>Giá bán (VNĐ) <span className="text-destructive">*</span></Label>
              <Input 
                type="number"
                value={price}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                placeholder="Nhập giá bán cho chi nhánh này"
                min={0}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              className="flex-1" 
              onClick={onAssign}
              disabled={!selectedProduct || isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Thêm vào danh mục
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
