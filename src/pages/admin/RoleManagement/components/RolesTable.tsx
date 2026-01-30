import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Shield, Trash2 } from 'lucide-react';
import type { AdminRole } from '@/types/admin/role.types';

type Props = {
  roles: AdminRole[];
  loading?: boolean;
  onEdit: (role: AdminRole) => void;
  onDelete: (id: number) => void | Promise<void>;
};

export const RolesTable: React.FC<Props> = ({ roles, loading, onEdit, onDelete }) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-4 font-medium">Vai trò</th>
            <th className="text-left p-4 font-medium">Mã</th>
            <th className="text-center p-4 font-medium">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="p-6 text-center text-sm text-muted-foreground">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-6 text-center text-sm text-muted-foreground">
                Không có vai trò phù hợp.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.roleId} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    <Shield size={14} />
                    {role.name}
                  </span>
                </td>

                <td className="p-4 text-sm text-muted-foreground">ID: {role.roleId}</td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(role.roleId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
