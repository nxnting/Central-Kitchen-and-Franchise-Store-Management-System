import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStores } from '@/data/mockData';
import { 
  Plus, 
  Search, 
  Store,
  Factory,
  Edit, 
  Trash2,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Kitchen {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  capacity: number;
}

const LocationManagement: React.FC = () => {
  const [stores, setStores] = useState(mockStores.map(s => ({ ...s, status: 'active' as const, phone: '028 1234 5678' })));
  const [kitchens, setKitchens] = useState<Kitchen[]>([
    { id: 'K1', name: 'Bếp Trung Tâm Q1', address: '123 Lê Lợi, Q1, HCM', phone: '028 1234 5678', manager: 'Nguyễn Văn A', status: 'active', capacity: 500 },
    { id: 'K2', name: 'Bếp Dự Phòng Q7', address: '456 Nguyễn Hữu Thọ, Q7, HCM', phone: '028 9876 5432', manager: 'Trần Thị B', status: 'active', capacity: 300 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'store' | 'kitchen'>('store');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKitchens = kitchens.filter(k => 
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStore = () => {
    setDialogType('store');
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleAddKitchen = () => {
    setDialogType('kitchen');
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast.success(`Đã ${selectedItem ? 'cập nhật' : 'thêm'} ${dialogType === 'store' ? 'cửa hàng' : 'bếp'}`);
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (type: 'store' | 'kitchen', id: string) => {
    if (type === 'store') {
      setStores(prev => prev.filter(s => s.id !== id));
    } else {
      setKitchens(prev => prev.filter(k => k.id !== id));
    }
    toast.success(`Đã xóa ${type === 'store' ? 'cửa hàng' : 'bếp'}`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quản lý Cửa hàng & Bếp" 
        subtitle="Quản lý danh sách cửa hàng franchise và bếp trung tâm"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stores.length}</p>
              <p className="text-sm text-muted-foreground">Cửa hàng</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kitchens.length}</p>
              <p className="text-sm text-muted-foreground">Bếp trung tâm</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stores.filter(s => s.status === 'active').length + kitchens.filter(k => k.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stores.filter(s => s.status !== 'active').length + kitchens.filter(k => k.status !== 'active').length}</p>
              <p className="text-sm text-muted-foreground">Tạm ngưng</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stores" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="stores" className="gap-2">
              <Store size={16} />
              Cửa hàng ({stores.length})
            </TabsTrigger>
            <TabsTrigger value="kitchens" className="gap-2">
              <Factory size={16} />
              Bếp trung tâm ({kitchens.length})
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddStore}>
              <Plus size={16} className="mr-2" />
              Thêm cửa hàng
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map(store => (
              <div key={store.id} className="bg-card border rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    store.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {store.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
                
                <h3 className="font-semibold mb-2">{store.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {store.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {store.phone}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { setDialogType('store'); setSelectedItem(store); setIsDialogOpen(true); }}
                  >
                    <Edit size={14} className="mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDelete('store', store.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kitchens" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddKitchen}>
              <Plus size={16} className="mr-2" />
              Thêm bếp
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKitchens.map(kitchen => (
              <div key={kitchen.id} className="bg-card border rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Factory className="w-6 h-6 text-warning" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    kitchen.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {kitchen.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
                
                <h3 className="font-semibold mb-2">{kitchen.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {kitchen.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {kitchen.phone}
                  </p>
                  <p>Quản lý: <span className="text-foreground">{kitchen.manager}</span></p>
                  <p>Công suất: <span className="text-foreground">{kitchen.capacity} đơn/ngày</span></p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { setDialogType('kitchen'); setSelectedItem(kitchen); setIsDialogOpen(true); }}
                  >
                    <Edit size={14} className="mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDelete('kitchen', kitchen.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Chỉnh sửa' : 'Thêm'} {dialogType === 'store' ? 'cửa hàng' : 'bếp trung tâm'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Tên {dialogType === 'store' ? 'cửa hàng' : 'bếp'}</Label>
              <Input 
                defaultValue={selectedItem?.name || ''} 
                placeholder={dialogType === 'store' ? 'VD: Trà Sữa Q1 Nguyễn Huệ' : 'VD: Bếp Trung Tâm Q1'}
              />
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input 
                defaultValue={selectedItem?.address || ''} 
                placeholder="123 Đường ABC, Quận XYZ, HCM"
              />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input 
                defaultValue={selectedItem?.phone || ''} 
                placeholder="028 1234 5678"
              />
            </div>
            {dialogType === 'kitchen' && (
              <>
                <div>
                  <Label>Người quản lý</Label>
                  <Input 
                    defaultValue={selectedItem?.manager || ''} 
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <Label>Công suất (đơn/ngày)</Label>
                  <Input 
                    type="number"
                    defaultValue={selectedItem?.capacity || ''} 
                    placeholder="500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {selectedItem ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;
