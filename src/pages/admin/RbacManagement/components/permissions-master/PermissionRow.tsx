// src/pages/admin/RbacManagement/components/permissions-master/PermissionRow.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, KeyRound } from "lucide-react";
import type { AdminPermission } from "@/types/admin/permission.types";

type Props = {
  permission: AdminPermission;
  onEdit: (p: AdminPermission) => void;
  onDelete: (id: number) => void | Promise<void>;
};

const PermissionRow: React.FC<Props> = ({ permission: p, onEdit, onDelete }) => {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/20">
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            <KeyRound size={14} />
            {p.code}
          </span>
          <span className="text-xs text-muted-foreground">ID: {p.permissionId}</span>
        </div>

        {p.name ? <p className="text-sm text-muted-foreground mt-1">{p.name}</p> : null}
      </td>

      <td className="p-4 text-sm">
        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {p.groupName?.trim() || "Khác"}
        </span>
      </td>

      <td className="p-4 text-sm text-muted-foreground">{p.description || "—"}</td>

      <td className="p-4">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(p)} title="Sửa">
            <Edit size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(p.permissionId)}
            title="Xóa"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default PermissionRow;