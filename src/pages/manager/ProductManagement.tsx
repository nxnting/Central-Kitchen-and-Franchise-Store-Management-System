import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProducts, Product } from '@/data/mockData';
import { 
  Plus, 
  Search, 
  Coffee, 
  Edit, 
  Trash2,
  Eye,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category))];

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa sản phẩm');
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast.success('Đã cập nhật sản phẩm');
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quản lý Menu Trà Sữa" 
        subtitle="Quản lý danh sách sản phẩm và nguyên liệu"
        action={
          <Button onClick={() => { setSelectedProduct(null); setIsViewMode(false); setIsDialogOpen(true); }}>
            <Plus size={16} className="mr-2" />
            Thêm sản phẩm
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.map(category => {
        const categoryProducts = filteredProducts.filter(p => p.category === category);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Coffee size={20} className="text-primary" />
              {category}
              <span className="text-sm font-normal text-muted-foreground">({categoryProducts.length} sản phẩm)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryProducts.map(product => (
                <div key={product.id} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(product)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{product.description || 'Chưa có mô tả'}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Đơn vị: {product.unit}</span>
                    <span className="font-semibold text-primary">
                      {product.price?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isViewMode ? 'Chi tiết sản phẩm' : selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input 
                defaultValue={selectedProduct?.name || ''} 
                disabled={isViewMode}
                placeholder="VD: Trà sữa trân châu đường đen"
              />
            </div>
            <div>
              <Label>Danh mục</Label>
              <Input 
                defaultValue={selectedProduct?.category || ''} 
                disabled={isViewMode}
                placeholder="VD: Trà sữa"
              />
            </div>
            <div>
              <Label>Đơn vị tính</Label>
              <Input 
                defaultValue={selectedProduct?.unit || ''} 
                disabled={isViewMode}
                placeholder="VD: ly, kg, lít"
              />
            </div>
            <div>
              <Label>Giá (VNĐ)</Label>
              <Input 
                type="number"
                defaultValue={selectedProduct?.price || ''} 
                disabled={isViewMode}
                placeholder="VD: 35000"
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea 
                defaultValue={selectedProduct?.description || ''} 
                disabled={isViewMode}
                placeholder="Mô tả chi tiết sản phẩm..."
              />
            </div>

            {!isViewMode && (
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  {selectedProduct ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
