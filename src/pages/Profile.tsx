import React from 'react';
import { useAuth, getRoleDisplayName } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/auth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Store, Clock, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Thông tin cá nhân" subtitle="Xem thông tin tài khoản của bạn" />

      <div className="bg-card rounded-xl border p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.displayName}</h2>
            <p className="text-muted-foreground">{getRoleDisplayName(user.role)}</p>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <User size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tài khoản</p>
              <p className="font-medium">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Mail size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.username}@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Shield size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vai trò</p>
              <p className="font-medium">{getRoleDisplayName(user.role)}</p>
            </div>
          </div>

          {user.storeName && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Store size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cửa hàng</p>
                <p className="font-medium">{user.storeName}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Clock size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đăng nhập lần cuối</p>
              <p className="font-medium">Hôm nay lúc 9:00</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-t pt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;