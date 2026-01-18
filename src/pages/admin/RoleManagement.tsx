import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Shield,
  Check,
  X,
  Edit,
  Users,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const RoleManagement: React.FC = () => {
  const permissions: Permission[] = [
    { id: 'view_orders', name: 'Xem đơn hàng', description: 'Xem danh sách và chi tiết đơn hàng' },
    { id: 'create_orders', name: 'Tạo đơn hàng', description: 'Tạo đơn đặt hàng mới' },
    { id: 'manage_orders', name: 'Quản lý đơn hàng', description: 'Duyệt, hủy, cập nhật đơn hàng' },
    { id: 'view_inventory', name: 'Xem tồn kho', description: 'Xem thông tin tồn kho' },
    { id: 'manage_inventory', name: 'Quản lý tồn kho', description: 'Thêm, sửa, xuất kho' },
    { id: 'view_production', name: 'Xem sản xuất', description: 'Xem kế hoạch và tiến độ sản xuất' },
    { id: 'manage_production', name: 'Quản lý sản xuất', description: 'Lập kế hoạch, cập nhật sản xuất' },
    { id: 'view_delivery', name: 'Xem giao hàng', description: 'Xem lịch và tiến độ giao hàng' },
    { id: 'manage_delivery', name: 'Quản lý giao hàng', description: 'Lập lịch, điều phối giao hàng' },
    { id: 'view_reports', name: 'Xem báo cáo', description: 'Xem báo cáo và thống kê' },
    { id: 'manage_products', name: 'Quản lý sản phẩm', description: 'Thêm, sửa, xóa sản phẩm' },
    { id: 'manage_recipes', name: 'Quản lý công thức', description: 'Thêm, sửa, xóa công thức' },
    { id: 'manage_users', name: 'Quản lý người dùng', description: 'Thêm, sửa, xóa người dùng' },
    { id: 'manage_system', name: 'Cấu hình hệ thống', description: 'Thay đổi cài đặt hệ thống' },
  ];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'franchise_store',
      name: 'franchise_store',
      label: 'Nhân viên cửa hàng',
      description: 'Tạo đơn hàng, nhận hàng, quản lý tồn kho cửa hàng',
      userCount: 25,
      permissions: ['view_orders', 'create_orders', 'view_inventory'],
    },
    {
      id: 'central_kitchen',
      name: 'central_kitchen',
      label: 'Nhân viên bếp',
      description: 'Tiếp nhận đơn, sản xuất, quản lý tồn kho bếp',
      userCount: 12,
      permissions: ['view_orders', 'manage_orders', 'view_inventory', 'manage_inventory', 'view_production', 'manage_production'],
    },
    {
      id: 'supply_coordinator',
      name: 'supply_coordinator',
      label: 'Điều phối cung ứng',
      description: 'Điều phối sản xuất, giao hàng, xử lý sự cố',
      userCount: 5,
      permissions: ['view_orders', 'manage_orders', 'view_production', 'view_delivery', 'manage_delivery'],
    },
    {
      id: 'manager',
      name: 'manager',
      label: 'Quản lý vận hành',
      description: 'Quản lý toàn bộ quy trình, xem báo cáo',
      userCount: 3,
      permissions: ['view_orders', 'manage_orders', 'view_inventory', 'manage_inventory', 'view_production', 'manage_production', 'view_delivery', 'view_reports', 'manage_products', 'manage_recipes'],
    },
    {
      id: 'admin',
      name: 'admin',
      label: 'Quản trị viên',
      description: 'Toàn quyền quản lý hệ thống',
      userCount: 2,
      permissions: permissions.map(p => p.id),
    },
  ]);

  const [editingRole, setEditingRole] = useState<string | null>(null);

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId],
        };
      }
      return role;
    }));
  };

  const handleSave = () => {
    toast.success('Đã lưu thay đổi phân quyền');
    setEditingRole(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Phân quyền Vai trò" 
        subtitle="Quản lý quyền truy cập cho từng vai trò trong hệ thống"
      />

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {roles.map(role => (
          <div key={role.id} className="bg-card border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{role.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={14} />
              <span>{role.userCount} người dùng</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {role.permissions.length}/{permissions.length} quyền
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-medium sticky left-0 bg-muted/30 min-w-[200px]">
                  Quyền hạn
                </th>
                {roles.map(role => (
                  <th key={role.id} className="text-center p-4 font-medium min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs">{role.label}</span>
                      {editingRole === role.id ? (
                        <Button size="sm" variant="outline" onClick={handleSave}>
                          Lưu
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingRole(role.id)}
                          disabled={role.id === 'admin'}
                        >
                          <Edit size={12} />
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map(permission => (
                <tr key={permission.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-4 sticky left-0 bg-card">
                    <div>
                      <p className="font-medium text-sm">{permission.name}</p>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </td>
                  {roles.map(role => {
                    const hasPermission = role.permissions.includes(permission.id);
                    const isEditing = editingRole === role.id;
                    
                    return (
                      <td key={role.id} className="p-4 text-center">
                        {isEditing ? (
                          <Switch
                            checked={hasPermission}
                            onCheckedChange={() => togglePermission(role.id, permission.id)}
                          />
                        ) : (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            hasPermission ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                          }`}>
                            {hasPermission ? <Check size={16} /> : <X size={16} />}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
