import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from '@/types/admin/permission.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPermission: AdminPermission | null;
  onCreate: (payload: CreatePermissionPayload) => void | Promise<void>;
  onUpdate: (id: number, payload: UpdatePermissionPayload) => void | Promise<void>;
};

export const PermissionUpsertModal: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedPermission,
  onCreate,
  onUpdate,
}) => {
  const isEdit = !!selectedPermission;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return;

    setCode(selectedPermission?.code ?? '');
    setName(selectedPermission?.name ?? '');
    setGroupName(selectedPermission?.groupName ?? '');
    setDescription(selectedPermission?.description ?? '');
  }, [open, selectedPermission]);

  const canSubmit = useMemo(() => {
    return code.trim().length > 0 && description.trim().length > 0;
  }, [code, description]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload = {
      code: code.trim(),
      name: name.trim() || undefined,
      groupName: groupName.trim() || undefined,
      description: description.trim(),
    };

    if (selectedPermission) {
      await onUpdate(selectedPermission.permissionId, payload);
      return;
    }

    await onCreate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa quyền' : 'Thêm quyền mới'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Code *</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: ORDER_CREATE"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gợi ý: UPPER_CASE + dấu gạch dưới.
            </p>
          </div>

          <div>
            <Label>Tên (optional)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Tạo đơn" />
          </div>

          <div>
            <Label>Nhóm (optional)</Label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="VD: Đơn hàng"
            />
          </div>

          <div>
            <Label>Mô tả *</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Cho phép tạo đơn mới"
            />
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

export default PermissionUpsertModal;
