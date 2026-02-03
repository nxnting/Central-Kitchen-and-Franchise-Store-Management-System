import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ShieldCheck } from 'lucide-react';

import type { AdminRole } from '@/types/admin/role.types';
import { useRolePermissions } from '@/hooks/admin/useRolePermissions';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminRole | null;
};

const normalize = (s?: string) => (s ?? '').trim().toLowerCase();

export const RolePermissionsModal: React.FC<Props> = ({ open, onOpenChange, role }) => {
  const roleId = role?.roleId ?? null;

  const { loading, permissions, assignedIds, save, reload } = useRolePermissions({
    roleId,
    enabled: open,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // mỗi lần mở modal / đổi role: sync selectedIds từ assignedIds
  useEffect(() => {
    if (!open) return;
    setSearchTerm('');
    setSelectedIds(assignedIds ?? []);
  }, [open, roleId, assignedIds]);

  const filteredPermissions = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return permissions;

    return permissions.filter((p) => {
      const code = normalize(p.code);
      const desc = normalize(p.description);
      const group = normalize(p.groupName);
      const name = normalize(p.name);
      return (
        code.includes(term) ||
        desc.includes(term) ||
        group.includes(term) ||
        name.includes(term)
      );
    });
  }, [permissions, searchTerm]);

  // group theo groupName (nếu không có thì "Khác")
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredPermissions>();
    for (const p of filteredPermissions) {
      const g = (p.groupName?.trim() || 'Khác') as string;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }

    // sort permissions trong group theo code cho dễ nhìn
    for (const [k, arr] of map) {
      map.set(
        k,
        [...arr].sort((a, b) => (a.code || '').localeCompare(b.code || ''))
      );
    }

    // sort group name
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredPermissions]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = (permissionId: number, nextChecked: boolean) => {
    setSelectedIds((prev) => {
      if (nextChecked) return prev.includes(permissionId) ? prev : [...prev, permissionId];
      return prev.filter((id) => id !== permissionId);
    });
  };

  const visibleIds = useMemo(() => filteredPermissions.map((p) => p.permissionId), [filteredPermissions]);

  const allVisibleSelected = useMemo(() => {
    if (visibleIds.length === 0) return false;
    return visibleIds.every((id) => selectedSet.has(id));
  }, [visibleIds, selectedSet]);

  const handleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      visibleIds.forEach((id) => set.add(id));
      return [...set];
    });
  };

  const handleClearAllVisible = () => {
    setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
  };

  const canSubmit = useMemo(() => !!roleId && !loading, [roleId, loading]);

  const handleSave = async () => {
    if (!roleId) return;
    await save(selectedIds);
    onOpenChange(false);
  };

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setSearchTerm('');
      setSelectedIds([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={18} />
            Gán quyền cho vai trò
          </DialogTitle>
        </DialogHeader>

        {/* Role info */}
        <div className="bg-muted/30 border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Vai trò</p>
          <p className="font-semibold">
            {role ? `${role.name} (ID: ${role.roleId})` : '—'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <Label>Tìm quyền</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                placeholder="Tìm theo code / mô tả / nhóm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => reload()}
              disabled={!roleId || loading}
            >
              Refresh
            </Button>

            {allVisibleSelected ? (
              <Button
                variant="outline"
                onClick={handleClearAllVisible}
                disabled={!roleId || loading || visibleIds.length === 0}
              >
                Bỏ chọn tất cả
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSelectAllVisible}
                disabled={!roleId || loading || visibleIds.length === 0}
              >
                Chọn tất cả
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="border rounded-xl overflow-hidden">
          <div className="max-h-[420px] overflow-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Đang tải dữ liệu...</div>
            ) : permissions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Chưa có quyền nào trong hệ thống.</div>
            ) : filteredPermissions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Không có quyền phù hợp.</div>
            ) : (
              <div className="divide-y">
                {grouped.map(([groupName, items]) => (
                  <div key={groupName}>
                    <div className="px-4 py-3 bg-muted/30 border-b">
                      <p className="text-sm font-semibold">{groupName}</p>
                      <p className="text-xs text-muted-foreground">{items.length} quyền</p>
                    </div>

                    <div className="divide-y">
                      {items.map((p) => {
                        const checked = selectedSet.has(p.permissionId);
                        return (
                          <div
                            key={p.permissionId}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => toggle(p.permissionId, Boolean(v))}
                              disabled={!roleId || loading}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{p.code}</p>
                              <p className="text-sm text-muted-foreground">{p.description || '—'}</p>
                            </div>
                            <div className="text-xs text-muted-foreground pt-1">
                              ID: {p.permissionId}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={!canSubmit}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RolePermissionsModal;
