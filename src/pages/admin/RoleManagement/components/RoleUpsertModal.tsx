import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminRole, CreateRolePayload, UpdateRolePayload } from '@/types/admin/role.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: AdminRole | null;
  onCreate: (payload: CreateRolePayload) => void | Promise<void>;
  onUpdate: (id: number, payload: UpdateRolePayload) => void | Promise<void>;
};

export const RoleUpsertModal: React.FC<Props> = ({ open, onOpenChange, selectedRole, onCreate, onUpdate }) => {
  const isEdit = !!selectedRole;
  const [name, setName] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(selectedRole?.name ?? '');
  }, [open, selectedRole]);

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (selectedRole) {
      await onUpdate(selectedRole.roleId, { name: name.trim() });
      return;
    }
    await onCreate({ name: name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Tên vai trò</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin / Manager / ..." />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!canSubmit}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
