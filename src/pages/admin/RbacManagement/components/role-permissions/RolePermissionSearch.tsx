// src/pages/admin/RbacManagement/components/role-permissions/RolePermissionSearch.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
  loading?: boolean;
  canSave: boolean;
};

const RolePermissionSearch: React.FC<Props> = ({ value, onChange, onSave, loading, canSave }) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm theo code / mô tả / nhóm..."
      />
      <Button onClick={onSave} disabled={!!loading || !canSave}>
        Lưu
      </Button>
    </div>
  );
};

export default RolePermissionSearch;