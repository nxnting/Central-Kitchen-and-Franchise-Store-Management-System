import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/input';
import { mockInventory, mockStores } from '@/data/mockData';
import { 
  Search, 
  Warehouse,
  Store,
  AlertTriangle,
  TrendingDown,
  Package
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InventoryOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = mockInventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = mockInventory.filter(item => item.quantity <= (item.minStock || 10));
  const expiringItems = mockInventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  });

  // Mock store inventory
  const storeInventoryData = mockStores.map(store => ({
    ...store,
    inventory: mockInventory.slice(0, 5).map(item => ({
      ...item,
      quantity: Math.floor(Math.random() * 100) + 10,
    })),
  }));

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Tồn kho Tổng" 
        subtitle="Theo dõi tồn kho bếp trung tâm và các cửa hàng"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockInventory.length}</p>
              <p className="text-sm text-muted-foreground">Tổng mặt hàng</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
              <p className="text-sm text-muted-foreground">Tồn kho thấp</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiringItems.length}</p>
              <p className="text-sm text-muted-foreground">Sắp hết hạn</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStores.length}</p>
              <p className="text-sm text-muted-foreground">Cửa hàng</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="central" className="space-y-4">
        <TabsList>
          <TabsTrigger value="central" className="gap-2">
            <Warehouse size={16} />
            Bếp Trung Tâm
          </TabsTrigger>
          <TabsTrigger value="stores" className="gap-2">
            <Store size={16} />
            Cửa hàng ({mockStores.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="central" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Inventory Table */}
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium">Tên nguyên liệu</th>
                  <th className="text-left p-4 font-medium">Loại</th>
                  <th className="text-right p-4 font-medium">Số lượng</th>
                  <th className="text-right p-4 font-medium">Tồn tối thiểu</th>
                  <th className="text-left p-4 font-medium">Lô/HSD</th>
                  <th className="text-center p-4 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
              {filteredInventory.map(item => {
                  const minStock = item.minStock || 10;
                  const isLowStock = item.quantity <= minStock;
                  const isExpiringSoon = item.expiryDate && (() => {
                    const expiry = new Date(item.expiryDate);
                    const today = new Date();
                    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                  })();

                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="p-4 font-medium">{item.productName}</td>
                      <td className="p-4 text-muted-foreground">{item.category}</td>
                      <td className="p-4 text-right">{item.quantity} {item.unit}</td>
                      <td className="p-4 text-right text-muted-foreground">{minStock} {item.unit}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{item.batchNumber || '-'}</p>
                          {item.expiryDate && (
                            <p className={`text-xs ${isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'}`}>
                              HSD: {item.expiryDate}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                            <TrendingDown size={12} />
                            Tồn thấp
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            <AlertTriangle size={12} />
                            Sắp hết hạn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            Bình thường
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {storeInventoryData.map(store => (
              <div key={store.id} className="bg-card border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b bg-muted/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2 text-sm font-medium text-muted-foreground">Mặt hàng</th>
                        <th className="text-right pb-2 text-sm font-medium text-muted-foreground">Tồn kho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.inventory.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2 text-sm">{item.productName}</td>
                          <td className="py-2 text-sm text-right">{item.quantity} {item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryOverview;
