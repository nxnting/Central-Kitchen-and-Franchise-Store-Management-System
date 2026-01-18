import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockProductionSummary, ProductionSummaryItem } from '@/data/mockData';
import { 
  Package, 
  Play, 
  Check, 
  Eye,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ProductionSummary: React.FC = () => {
  const [summaryItems, setSummaryItems] = useState(mockProductionSummary);
  const [selectedProduct, setSelectedProduct] = useState<ProductionSummaryItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'in_progress':
        return 'bg-info/10 text-info border-info/30';
      case 'completed':
        return 'bg-success/10 text-success border-success/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ sản xuất';
      case 'in_progress':
        return 'Đang sản xuất';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getAllocationStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'text-success';
      case 'partial':
        return 'text-warning';
      case 'pending':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAllocationStatusLabel = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'Đủ';
      case 'partial':
        return 'Thiếu';
      case 'pending':
        return 'Chờ';
      default:
        return status;
    }
  };

  const handleViewDetail = (item: ProductionSummaryItem) => {
    setSelectedProduct(item);
    setDetailDialogOpen(true);
  };

  const handleStartProduction = (itemId: string) => {
    setSummaryItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, status: 'in_progress' as const } : item
      )
    );
    toast.success('Đã bắt đầu sản xuất');
  };

  const handleCompleteProduction = (itemId: string) => {
    setSummaryItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, status: 'completed' as const, totalProduced: item.totalRequired, remaining: 0 } 
          : item
      )
    );
    toast.success('Đã hoàn thành sản xuất');
  };

  const stats = {
    total: summaryItems.length,
    pending: summaryItems.filter(i => i.status === 'pending').length,
    inProgress: summaryItems.filter(i => i.status === 'in_progress').length,
    completed: summaryItems.filter(i => i.status === 'completed').length,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Tổng hợp Đơn Sản xuất" 
        subtitle="Xem tổng hợp đơn đặt hàng đã duyệt, gom nhóm theo sản phẩm"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Chờ sản xuất</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">Đang sản xuất</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Summary Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30">
          <h3 className="font-semibold">Danh sách sản phẩm cần sản xuất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Loại</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Cần SX</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Đã SX</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Còn thiếu</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Tiến độ</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {summaryItems.map((item) => {
                const progress = Math.round((item.totalProduced / item.totalRequired) * 100);
                return (
                  <tr key={item.id} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold">{item.totalRequired}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-success">{item.totalProduced}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.remaining > 0 ? (
                        <>
                          <span className="font-semibold text-warning">{item.remaining}</span>
                          <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                        </>
                      ) : (
                        <span className="text-success">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(item)}
                          className="h-8 px-2"
                        >
                          <Eye size={16} className="mr-1" />
                          Chi tiết
                        </Button>
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartProduction(item.id)}
                            className="h-8"
                          >
                            <Play size={14} className="mr-1" />
                            Bắt đầu
                          </Button>
                        )}
                        {item.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCompleteProduction(item.id)}
                            className="h-8"
                          >
                            <Check size={14} className="mr-1" />
                            Hoàn thành
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="block">{selectedProduct?.productName}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedProduct?.id} • {selectedProduct?.category}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{selectedProduct.totalRequired}</p>
                  <p className="text-sm text-muted-foreground">Tổng cần SX ({selectedProduct.unit})</p>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-success">{selectedProduct.totalProduced}</p>
                  <p className="text-sm text-muted-foreground">Đã sản xuất ({selectedProduct.unit})</p>
                </div>
                <div className="bg-warning/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-warning">{selectedProduct.remaining}</p>
                  <p className="text-sm text-muted-foreground">Còn thiếu ({selectedProduct.unit})</p>
                </div>
                <div className="bg-info/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-info">
                    {Math.round((selectedProduct.totalProduced / selectedProduct.totalRequired) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Tiến độ</p>
                </div>
              </div>

              {/* Store Allocation Table */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package size={18} />
                  Phân bổ theo cửa hàng
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="text-left px-4 py-3 text-sm font-medium">Cửa hàng</th>
                        <th className="text-center px-4 py-3 text-sm font-medium">Yêu cầu</th>
                        <th className="text-center px-4 py-3 text-sm font-medium">Đã phân bổ</th>
                        <th className="text-center px-4 py-3 text-sm font-medium">Còn thiếu</th>
                        <th className="text-center px-4 py-3 text-sm font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.storeAllocations.map((alloc) => (
                        <tr key={alloc.storeId} className="border-b last:border-b-0 hover:bg-muted/10">
                          <td className="px-4 py-3 font-medium">{alloc.storeName}</td>
                          <td className="px-4 py-3 text-center">{alloc.required} {selectedProduct.unit}</td>
                          <td className="px-4 py-3 text-center font-medium text-success">
                            {alloc.allocated} {selectedProduct.unit}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {alloc.required - alloc.allocated > 0 ? (
                              <span className="text-warning font-medium">
                                {alloc.required - alloc.allocated} {selectedProduct.unit}
                              </span>
                            ) : (
                              <span className="text-success">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 font-medium ${getAllocationStatusColor(alloc.status)}`}>
                              {alloc.status === 'fulfilled' && <CheckCircle2 size={14} />}
                              {alloc.status === 'partial' && <AlertCircle size={14} />}
                              {alloc.status === 'pending' && <Clock size={14} />}
                              {getAllocationStatusLabel(alloc.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Production Batches */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Layers size={18} />
                  Mẻ sản xuất
                </h4>
                {selectedProduct.batches.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProduct.batches.map((batch) => (
                      <div 
                        key={batch.id} 
                        className={`border rounded-lg p-4 ${
                          batch.status === 'completed' 
                            ? 'border-success/30 bg-success/5' 
                            : batch.status === 'in_progress'
                            ? 'border-info/30 bg-info/5'
                            : 'border-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{batch.batchNumber}</p>
                              <p className="text-sm text-muted-foreground">{batch.assignedTo}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-semibold">{batch.quantity} {selectedProduct.unit}</p>
                              <p className="text-sm text-muted-foreground">
                                {batch.producedAt || 'Chưa bắt đầu'}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}>
                              {getStatusLabel(batch.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Chưa có mẻ sản xuất nào</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionSummary;
