import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Shield, Trash2, UserCheck, UserX } from 'lucide-react';
import type { AdminUser } from '@/types/admin/user.types';

type Props = {
  users: AdminUser[];
  loading?: boolean;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

const getRoleBadgeColor = (roleName: string) => {
  const r = roleName?.toLowerCase();
  const colors: Record<string, string> = {
    admin: 'bg-destructive/10 text-destructive',
    manager: 'bg-success/10 text-success',
    supplycoordinator: 'bg-primary/10 text-primary',
    kitchenstaff: 'bg-warning/10 text-warning',
    storestaff: 'bg-info/10 text-info',
  };
  return colors[r] || 'bg-muted text-muted-foreground';
};

export const UsersTable: React.FC<Props> = ({ users, loading, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-4 font-medium">Người dùng</th>
            <th className="text-left p-4 font-medium">Vai trò</th>
            <th className="text-left p-4 font-medium">Liên hệ</th>
            <th className="text-center p-4 font-medium">Trạng thái</th>
            <th className="text-center p-4 font-medium">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                Không có người dùng phù hợp.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">ID: {user.userId}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.roleName
                    )}`}
                  >
                    <Shield size={12} />
                    {user.roleName}
                  </span>
                </td>

                <td className="p-4">
                  <div className="text-sm">
                    <p className="flex items-center gap-1">
                      <Mail size={12} className="text-muted-foreground" />
                      {user.email}
                    </p>
                  </div>
                </td>

                <td className="p-4 text-center">
                  {user.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      <UserCheck size={12} />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <UserX size={12} />
                      Đã khóa
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                      <Edit size={16} />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => onToggleStatus(user)}>
                      {user.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(user.userId)}
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
