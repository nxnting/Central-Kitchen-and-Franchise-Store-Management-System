import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { X, Building2, Store, CookingPot, Shield, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/types/admin/user.types';
import type { AdminFranchise } from '@/types/admin/franchise.types';
import { useUserFranchises } from '@/hooks/admin/useUserFranchises';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
};

const isAdminRole = (roleName?: string) => (roleName || '').toLowerCase() === 'admin';

const typeBadge = (type: AdminFranchise['type']) => {
  if (type === 'STORE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
        <Store size={12} />
        STORE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
      <CookingPot size={12} />
      CENTRAL_KITCHEN
    </span>
  );
};

export const UserFranchiseAssignModal: React.FC<Props> = ({ open, onOpenChange, user }) => {
  const [q, setQ] = useState('');

  const {
    franchises,
    filteredFranchises,
    selectedIds,
    setSelectedIds,
    getFranchiseId,
    isAllowedFranchise,
    loading,
    submitting,
    submit,
  } = useUserFranchises(user, open);

  const isAdmin = isAdminRole(user?.roleName);

  const list = useMemo(() => {
    const base = filteredFranchises?.length ? filteredFranchises : (franchises || []);
    const term = q.trim().toLowerCase();
    if (!term) return base;

    return base.filter((f) => {
      const hay = `${f.name} ${f.address} ${f.location}`.toLowerCase();
      return hay.includes(term);
    });
  }, [filteredFranchises, franchises, q]);

  const toggle = (fid: number) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (s.has(fid)) s.delete(fid);
      else s.add(fid);
      return Array.from(s);
    });
  };

  const close = () => onOpenChange(false);

  const handleSave = async () => {
    try {
      await submit();
      toast.success('Đã cập nhật gán cửa hàng / bếp');
      close();
    } catch (e: any) {
      toast.error(e?.message || 'Cập nhật thất bại');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      {/* dialog */}
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="text-primary" size={18} />
            </div>
            <div>
              <p className="font-semibold leading-tight">Gán cửa hàng / bếp</p>
              <p className="text-sm text-muted-foreground">
                Chọn franchise để gán cho người dùng
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={close}>
            <X size={18} />
          </Button>
        </div>

        {/* body */}
        <div className="p-4 space-y-4">
          {/* user info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-muted/30 border rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Người dùng</p>
              <p className="font-medium">{user?.username || '-'}</p>
              <p className="text-xs text-muted-foreground">ID: {user?.userId ?? '-'}</p>
            </div>

            <div className="bg-muted/30 border rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium break-all">{user?.email || '-'}</p>
            </div>

            <div className="bg-muted/30 border rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Vai trò</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                <Shield size={12} />
                {user?.roleName || '-'}
              </span>
              {isAdmin && (
                <p className="text-xs mt-2 text-destructive">
                  Admin không cần gán cửa hàng / bếp.
                </p>
              )}
            </div>
          </div>

          {/* search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên / địa chỉ / location..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setQ('')}
              disabled={!q || loading}
            >
              Xóa
            </Button>
          </div>

          {/* list */}
          <div className="border rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-muted/30 border-b flex items-center justify-between">
              <p className="text-sm font-medium">Danh sách franchise</p>
              <p className="text-xs text-muted-foreground">
                Đã chọn: <span className="font-medium">{selectedIds.length}</span>
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Đang tải dữ liệu...</div>
            ) : list.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Không có franchise phù hợp.
              </div>
            ) : (
              <div className="max-h-[380px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-background">
                      <th className="text-left p-3 w-12"></th>
                      <th className="text-left p-3 font-medium">Tên</th>
                      <th className="text-left p-3 font-medium">Loại</th>
                      <th className="text-left p-3 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((f) => {
                      const fid = getFranchiseId(f);
                      const checked = selectedIds.includes(fid);
                      const allowed = isAllowedFranchise(f);

                      return (
                        <tr
                          key={fid}
                          className={`border-b last:border-0 hover:bg-muted/20 ${
                            !allowed || isAdmin ? 'opacity-60' : ''
                          }`}
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={!allowed || isAdmin}
                              onChange={() => toggle(fid)}
                              className="h-4 w-4"
                            />
                          </td>

                          <td className="p-3">
                            <p className="font-medium">{f.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {f.address} • {f.location}
                            </p>
                          </td>

                          <td className="p-3">{typeBadge(f.type)}</td>

                          <td className="p-3">
                            {f.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                INACTIVE
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="p-4 border-t flex items-center justify-end gap-2">
          <Button variant="outline" onClick={close} disabled={submitting}>
            Hủy
          </Button>

          <Button
            onClick={handleSave}
            disabled={submitting || loading || isAdmin || selectedIds.length === 0}
          >
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserFranchiseAssignModal;
