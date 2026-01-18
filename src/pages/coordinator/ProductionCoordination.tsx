import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { mockProductionSummary, ProductionSummaryItem } from '@/data/mockData';
import { 
  Factory,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertTriangle,
  TrendingUp,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const ProductionCoordination: React.FC = () => {
  const [productions, setProductions] = useState(mockProductionSummary);

  const stats = {
    total: productions.length,
    pending: productions.filter(p => p.status === 'pending').length,
    inProgress: productions.filter(p => p.status === 'in_progress').length,
    completed: productions.filter(p => p.status === 'completed').length,
  };

  const totalRequired = productions.reduce((sum, p) => sum + p.totalRequired, 0);
  const totalProduced = productions.reduce((sum, p) => sum + p.totalProduced, 0);
  const overallProgress = Math.round((totalProduced / totalRequired) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-info/10 text-info border-info/30';
      case 'completed': return 'bg-success/10 text-success border-success/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ sản xuất';
      case 'in_progress': return 'Đang sản xuất';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const handlePrioritize = (id: string) => {
    toast.success('Đã ưu tiên sản phẩm này trong kế hoạch sản xuất');
  };

  const handleRequestProduction = (id: string) => {
    setProductions(prev => prev.map(p => 
      p.productId === id ? { ...p, status: 'in_progress' as const } : p
    ));
    toast.success('Đã gửi yêu cầu sản xuất đến bếp trung tâm');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Điều phối Sản xuất" 
        subtitle="Theo dõi và điều phối kế hoạch sản xuất"
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary" />
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
              <PlayCircle className="w-5 h-5 text-info" />
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
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Tiến độ chung</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tiến độ Sản xuất Tổng thể</h3>
          <span className="text-sm text-muted-foreground">
            {totalProduced.toLocaleString('vi-VN')} / {totalRequired.toLocaleString('vi-VN')} đơn vị
          </span>
        </div>
        <Progress value={overallProgress} className="h-3" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Đã sản xuất: {totalProduced.toLocaleString('vi-VN')}</span>
          <span>Còn thiếu: {(totalRequired - totalProduced).toLocaleString('vi-VN')}</span>
        </div>
      </div>

      {/* Production Items */}
      <div className="space-y-4">
        {productions.map(item => {
          const progress = Math.round((item.totalProduced / item.totalRequired) * 100);
          const remaining = item.totalRequired - item.totalProduced;
          
          return (
            <div key={item.productId} className="bg-card border rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Factory className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Yêu cầu từ {item.storeAllocations.length} cửa hàng
                    </p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status === 'pending' && <Clock size={14} />}
                  {item.status === 'in_progress' && <PlayCircle size={14} />}
                  {item.status === 'completed' && <CheckCircle2 size={14} />}
                  {getStatusLabel(item.status)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">{item.totalRequired}</p>
                  <p className="text-xs text-muted-foreground">Tổng yêu cầu</p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">{item.totalProduced}</p>
                  <p className="text-xs text-muted-foreground">Đã sản xuất</p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <p className="text-2xl font-bold text-warning">{remaining}</p>
                  <p className="text-xs text-muted-foreground">Còn thiếu</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{progress}%</p>
                  <p className="text-xs text-muted-foreground">Tiến độ</p>
                </div>
              </div>

              <Progress value={progress} className="h-2 mb-4" />

              {/* Store Allocations Summary */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Phân bổ theo cửa hàng:</p>
                <div className="flex flex-wrap gap-2">
                  {item.storeAllocations.map((alloc, idx) => (
                    <span 
                      key={idx} 
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        alloc.status === 'fulfilled' ? 'bg-success/10 text-success' :
                        alloc.status === 'partial' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {alloc.storeName}: {alloc.allocated}/{alloc.required}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                {item.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => handleRequestProduction(item.productId)}>
                      <PlayCircle size={14} className="mr-1" />
                      Yêu cầu sản xuất
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePrioritize(item.productId)}>
                      <AlertTriangle size={14} className="mr-1" />
                      Ưu tiên
                    </Button>
                  </>
                )}
                {item.status === 'in_progress' && (
                  <Button size="sm" variant="outline">
                    <Factory size={14} className="mr-1" />
                    Xem chi tiết sản xuất
                  </Button>
                )}
                {item.status === 'completed' && (
                  <Button size="sm" variant="secondary">
                    <Truck size={14} className="mr-1" />
                    Lập lịch giao hàng
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionCoordination;
