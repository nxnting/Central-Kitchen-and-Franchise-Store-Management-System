import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const dashboardPath = user ? getRoleDashboardPath(user.role) : '/login';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-destructive/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="z-10 flex flex-col items-center text-center px-4 max-w-md">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6 animate-bounce">
          <ShieldAlert size={48} className="text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">Truy cập bị từ chối</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Bạn không có quyền truy cập vào trang này.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Quay lại
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={() => navigate(dashboardPath)}
          >
            <Home size={18} />
            Về Trang chủ
          </Button>
        </div>
        
        {user && (
          <div className="mt-12 p-4 bg-muted/50 rounded-lg border border-border w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tài khoản hiện tại</p>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-sm text-muted-foreground italic">Vai trò: {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
