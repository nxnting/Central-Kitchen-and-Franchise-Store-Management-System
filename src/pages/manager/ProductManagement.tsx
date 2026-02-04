import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/products';
import type { Product } from '@/types/product';
import { 
  Plus, 
  Search, 
  Coffee, 
  Edit, 
  Eye,
  Package,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Shared components
import { StatusBadge, ProductTypeBadge, Pagination, SortableHeader, getProductTypeLabel } from '@/components/common';

type SortField = 'name' | 'sku' | 'unit' | 'status' | 'productType';
type SortOrder = 'asc' | 'desc';

const ProductManagement: React.FC = () => {
  // Filter & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Dialog states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  // React Query hooks
  const { data: productsResponse, isLoading, isError, refetch } = useProducts({
    status: statusFilter === 'all' ? 'ALL' : statusFilter as 'ACTIVE' | 'INACTIVE',
    productType: typeFilter !== 'all' ? typeFilter as 'FINISHED' | 'SEMI_FINISHED' : undefined,
    q: searchTerm || undefined,
    page: currentPage,
    pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  // Get products array from API response
  const products: Product[] = useMemo(() => {
    if (!productsResponse) return [];
    return productsResponse.data?.items || [];
  }, [productsResponse]);

  const totalItems = productsResponse?.data?.totalItems || 0;
  const totalPages = productsResponse?.data?.totalPages || 1;

  // Handlers
  const handleSort = (field: string) => {
    const typedField = field as SortField;
    if (sortField === typedField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(typedField);
      setSortOrder('asc');
    }
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

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast.success('Đã cập nhật sản phẩm');
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Quản lý Menu Trà Sữa" 
          subtitle="Quản lý danh sách sản phẩm"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Quản lý Menu Trà Sữa" 
          subtitle="Quản lý danh sách sản phẩm"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-destructive mb-4">Không thể tải dữ liệu sản phẩm</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quản lý Menu Trà Sữa" 
        subtitle="Quản lý danh sách sản phẩm"
        action={{
          label: 'Thêm sản phẩm',
          icon: Plus,
          onClick: handleAdd
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ACTIVE">Đang bán</SelectItem>
            <SelectItem value="INACTIVE">Ngừng bán</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="FINISHED">Thành phẩm</SelectItem>
            <SelectItem value="SEMI_FINISHED">Bán thành phẩm</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => refetch()} title="Làm mới">
            <RefreshCw size={18} />
          </Button>
          <span className="text-sm text-muted-foreground">
            Tổng: <span className="font-semibold text-foreground">{totalItems}</span> sản phẩm
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <SortableHeader label="Tên sản phẩm" field="name" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                <SortableHeader label="SKU" field="sku" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('unit')}>
                <SortableHeader label="Đơn vị" field="unit" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('productType')}>
                <SortableHeader label="Loại" field="productType" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <SortableHeader label="Trạng thái" field="status" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <Coffee size={40} className="mx-auto mb-2 opacity-30" />
                  <p>Không tìm thấy sản phẩm nào</p>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className={product.status === 'INACTIVE' ? 'opacity-60' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package size={18} className="text-primary" />
                      </div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    <ProductTypeBadge type={product.productType} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} activeLabel="Đang bán" inactiveLabel="Ngừng bán" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(product)} title="Xem chi tiết">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} title="Chỉnh sửa">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        />
      </div>

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
              <Label>SKU</Label>
              <Input 
                defaultValue={selectedProduct?.sku || ''} 
                disabled={isViewMode}
                placeholder="VD: TS-001"
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
              <Label>Loại sản phẩm</Label>
              <Select defaultValue={selectedProduct?.productType || 'FINISHED'} disabled={isViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FINISHED">Thành phẩm</SelectItem>
                  <SelectItem value="SEMI_FINISHED">Bán thành phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && isViewMode && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className={selectedProduct.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
                    {selectedProduct.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
                  </span>
                </div>
              </div>
            )}

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
