import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type {
  AdminFranchise,
  CreateFranchisePayload,
  FranchiseStatus,
  FranchiseType,
  UpdateFranchisePayload,
} from '@/types/admin/franchise.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: AdminFranchise | null;
  onCreate: (payload: CreateFranchisePayload) => void | Promise<void>;
  onUpdate: (id: number, payload: UpdateFranchisePayload) => void | Promise<void>;
};

const TYPE_OPTIONS: FranchiseType[] = ['STORE', 'CENTRAL_KITCHEN'];
const STATUS_OPTIONS: FranchiseStatus[] = ['ACTIVE', 'INACTIVE'];

export const FranchiseUpsertModal: React.FC<Props> = ({
  open,
  onOpenChange,
  selected,
  onCreate,
  onUpdate,
}) => {
  const isEdit = !!selected;

  const [name, setName] = useState('');
  const [type, setType] = useState<FranchiseType>('STORE');
  const [status, setStatus] = useState<FranchiseStatus>('ACTIVE');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!open) return;

    if (selected) {
      setName(selected.name);
      setType(selected.type);
      setStatus(selected.status);
      setAddress(selected.address);
      setLocation(selected.location);
    } else {
      setName('');
      setType('STORE');
      setStatus('ACTIVE');
      setAddress('');
      setLocation('');
    }
  }, [open, selected]);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && address.trim().length > 0 && location.trim().length > 0;
  }, [name, address, location]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload = {
      name: name.trim(),
      type,
      status,
      address: address.trim(),
      location: location.trim(),
    };

    if (selected) {
      await onUpdate(selected.franchiseId, payload);
      return;
    }
    await onCreate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa Franchise' : 'Thêm Franchise'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Tên</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Chi nhánh Quận 1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Loại</Label>
              <Select value={type} onValueChange={(v) => setType(v as FranchiseType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as FranchiseStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Địa chỉ</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Nguyễn Huệ, Q1, TP.HCM" />
          </div>

          <div>
            <Label>Khu vực</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="TP.HCM" />
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
