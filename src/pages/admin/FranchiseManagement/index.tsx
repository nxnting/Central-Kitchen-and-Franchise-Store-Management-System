import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Store, Factory, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { adminFranchisesApi } from '@/api/admin/franchises.api';
import type { AdminFranchise, CreateFranchisePayload, UpdateFranchisePayload } from '@/types/admin/franchise.types';
import { FranchisesGrid, FranchisesToolbar, FranchiseUpsertModal } from './components';

type TabKey = 'STORE' | 'CENTRAL_KITCHEN';

const FranchiseManagement: React.FC = () => {
  const [items, setItems] = useState<AdminFranchise[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<TabKey>('STORE');

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdminFranchise | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminFranchisesApi.list();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách franchise');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const stores = items.filter((x) => x.type === 'STORE').length;
    const kitchens = items.filter((x) => x.type === 'CENTRAL_KITCHEN').length;
    const active = items.filter((x) => x.status === 'ACTIVE').length;
    const inactive = items.filter((x) => x.status === 'INACTIVE').length;
    return { stores, kitchens, active, inactive };
  }, [items]);

  const filtered = useMemo(() => {
    const base = items.filter((x) => x.type === tab);
    const term = searchTerm.trim().toLowerCase();
    if (!term) return base;

    return base.filter((x) =>
      x.name.toLowerCase().includes(term) ||
      x.address.toLowerCase().includes(term) ||
      x.location.toLowerCase().includes(term)
    );
  }, [items, tab, searchTerm]);

  const handleOpenCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleOpenEdit = (f: AdminFranchise) => {
    setSelected(f);
    setOpen(true);
  };

  const handleCreate = async (payload: CreateFranchisePayload) => {
    try {
      await adminFranchisesApi.create(payload);
      toast.success('Đã thêm franchise');
      setOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Tạo franchise thất bại');
    }
  };

  const handleUpdate = async (id: number, payload: UpdateFranchisePayload) => {
    try {
      await adminFranchisesApi.update(id, payload);
      toast.success('Đã cập nhật franchise');
      setOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Cập nhật franchise thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFranchisesApi.remove(id);
      toast.success('Đã xóa franchise');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Xóa franchise thất bại');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Quản lý Cửa hàng & Bếp"
        subtitle="Quản lý danh sách cửa hàng franchise và bếp trung tâm"
        action={{ label: 'Thêm', icon: Plus, onClick: handleOpenCreate }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.stores}</p>
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
              <p className="text-2xl font-bold">{stats.kitchens}</p>
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
              <p className="text-2xl font-bold">{stats.active}</p>
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
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Tạm ngưng</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="STORE" className="gap-2">
              <Store size={16} />
              Cửa hàng ({stats.stores})
            </TabsTrigger>
            <TabsTrigger value="CENTRAL_KITCHEN" className="gap-2">
              <Factory size={16} />
              Bếp trung tâm ({stats.kitchens})
            </TabsTrigger>
          </TabsList>
        </div>

        <FranchisesToolbar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onRefresh={load}
          loading={loading}
        />

        <TabsContent value="STORE">
          <FranchisesGrid items={filtered} loading={loading} onEdit={handleOpenEdit} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="CENTRAL_KITCHEN">
          <FranchisesGrid items={filtered} loading={loading} onEdit={handleOpenEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>

      <FranchiseUpsertModal
        open={open}
        onOpenChange={setOpen}
        selected={selected}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default FranchiseManagement;
