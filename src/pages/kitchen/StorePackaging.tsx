import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { mockStorePackaging, StorePackaging as StorePackagingType } from '@/data/mockData';
import { 
  Package, 
  Truck, 
  Check,
  MapPin,
  Store,
  CheckCircle2,
  Clock,
  PackageCheck,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const StorePackaging: React.FC = () => {
  const [storeData, setStoreData] = useState(mockStorePackaging);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'packing':
        return 'bg-info/10 text-info border-info/30';
      case 'ready':
        return 'bg-success/10 text-success border-success/30';
      case 'dispatched':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ đóng gói';
      case 'packing':
        return 'Đang đóng gói';
      case 'ready':
        return 'Sẵn sàng giao';
      case 'dispatched':
        return 'Đã chuyển giao';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'packing':
        return <Package size={16} />;
      case 'ready':
        return <CheckCircle2 size={16} />;
      case 'dispatched':
        return <Truck size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleToggleItem = (storeId: string, productId: string) => {
    setStoreData(stores => 
      stores.map(store => {
        if (store.storeId === storeId) {
          const updatedItems = store.items.map(item => 
            item.productId === productId ? { ...item, packed: !item.packed } : item
          );
          const allPacked = updatedItems.every(item => item.packed || item.quantity === 0);
          return {
            ...store,
            items: updatedItems,
            status: allPacked ? 'ready' as const : 'packing' as const,
          };
        }
        return store;
      })
    );
  };

  const handleMarkReady = (storeId: string) => {
    setStoreData(stores => 
      stores.map(store => 
        store.storeId === storeId 
          ? { 
              ...store, 
              status: 'ready' as const,
              items: store.items.map(item => ({ ...item, packed: true }))
            } 
          : store
      )
    );
    toast.success('Đã đánh dấu sẵn sàng giao hàng');
  };

  const handleDispatch = (storeId: string) => {
    setStoreData(stores => 
      stores.map(store => 
        store.storeId === storeId ? { ...store, status: 'dispatched' as const } : store
      )
    );
    toast.success('Đã chuyển giao cho bộ phận điều phối');
  };

  const stats = {
    total: storeData.length,
    pending: storeData.filter(s => s.status === 'pending').length,
    packing: storeData.filter(s => s.status === 'packing').length,
    ready: storeData.filter(s => s.status === 'ready').length,
    dispatched: storeData.filter(s => s.status === 'dispatched').length,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Đóng gói theo Cửa hàng" 
        subtitle="Phân loại và đóng gói thành phẩm theo từng cửa hàng"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng cửa hàng</p>
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
              <p className="text-sm text-muted-foreground">Chờ đóng gói</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.packing}</p>
              <p className="text-sm text-muted-foreground">Đang đóng gói</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.ready}</p>
              <p className="text-sm text-muted-foreground">Sẵn sàng giao</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.dispatched}</p>
              <p className="text-sm text-muted-foreground">Đã chuyển giao</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Packaging Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {storeData.map((store) => (
          <div 
            key={store.storeId} 
            className={`bg-card border rounded-xl overflow-hidden ${
              store.status === 'dispatched' ? 'opacity-60' : ''
            }`}
          >
            {/* Store Header */}
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{store.storeName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={12} />
                    {store.address}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(store.status)}`}>
                {getStatusIcon(store.status)}
                {getStatusLabel(store.status)}
              </span>
            </div>

            {/* Items List */}
            <div className="p-4">
              <div className="space-y-3">
                {store.items.map((item) => (
                  <div 
                    key={item.productId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.quantity === 0 
                        ? 'bg-muted/20 border-dashed opacity-50' 
                        : item.packed 
                        ? 'bg-success/5 border-success/20' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.packed}
                        disabled={item.quantity === 0 || store.status === 'dispatched'}
                        onCheckedChange={() => handleToggleItem(store.storeId, item.productId)}
                      />
                      <div>
                        <p className={`font-medium ${item.packed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity > 0 ? `${item.quantity} ${item.unit}` : 'Chưa có hàng'}
                        </p>
                      </div>
                    </div>
                    {item.packed && item.quantity > 0 && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {store.status === 'packing' && (
                  <Button 
                    className="flex-1"
                    onClick={() => handleMarkReady(store.storeId)}
                  >
                    <Check size={16} className="mr-2" />
                    Hoàn tất đóng gói
                  </Button>
                )}
                {store.status === 'pending' && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStoreData(stores => 
                        stores.map(s => 
                          s.storeId === store.storeId ? { ...s, status: 'packing' as const } : s
                        )
                      );
                    }}
                  >
                    <Package size={16} className="mr-2" />
                    Bắt đầu đóng gói
                  </Button>
                )}
                {store.status === 'ready' && (
                  <Button 
                    className="flex-1"
                    variant="secondary"
                    onClick={() => handleDispatch(store.storeId)}
                  >
                    <Send size={16} className="mr-2" />
                    Chuyển giao điều phối
                  </Button>
                )}
                {store.status === 'dispatched' && (
                  <div className="flex-1 text-center py-2 text-sm text-muted-foreground">
                    <Truck size={16} className="inline mr-2" />
                    Đã chuyển cho bộ phận điều phối
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePackaging;
