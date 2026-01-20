import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings,
  Save,
  Scale,
  Clock,
  Bell,
  Database,
  Shield,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SystemConfig: React.FC = () => {
  const [config, setConfig] = useState({
    // Units
    defaultWeightUnit: 'kg',
    defaultVolumeUnit: 'lít',
    defaultCurrency: 'VND',
    
    // Workflow
    autoApproveOrders: false,
    requireQualityCheck: true,
    autoAssignProduction: true,
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    lowStockThreshold: 20,
    expiryAlertDays: 7,
    
    // System
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    dataRetentionDays: 365,
  });

  const handleSave = () => {
    toast.success('Đã lưu cấu hình hệ thống');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Cấu hình Hệ thống" 
        subtitle="Thiết lập các thông số và quy trình hệ thống"
        action={{
          label: 'Lưu cấu hình',
          icon: Save,
          onClick: handleSave
        }}
      />

      <Tabs defaultValue="units" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="units" className="gap-2">
            <Scale size={16} />
            Đơn vị
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <Clock size={16} />
            Quy trình
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Scale size={18} />
              Đơn vị đo lường
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Đơn vị khối lượng mặc định</Label>
                <Select defaultValue={config.defaultWeightUnit}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Đơn vị thể tích mặc định</Label>
                <Select defaultValue={config.defaultVolumeUnit}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lít">Lít (L)</SelectItem>
                    <SelectItem value="ml">Mililit (ml)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Đơn vị tiền tệ</Label>
                <Select defaultValue={config.defaultCurrency}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Database size={18} />
              Đơn vị tùy chỉnh
            </h3>
            <div className="space-y-3">
              {['ly', 'hộp', 'túi', 'chai', 'gói'].map(unit => (
                <div key={unit} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{unit}</span>
                  <Button variant="ghost" size="sm">Chỉnh sửa</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                + Thêm đơn vị mới
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} />
              Cấu hình Quy trình
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tự động duyệt đơn hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Đơn hàng sẽ được tự động duyệt mà không cần phê duyệt thủ công
                  </p>
                </div>
                <Switch 
                  checked={config.autoApproveOrders}
                  onCheckedChange={(checked) => setConfig({ ...config, autoApproveOrders: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu kiểm tra chất lượng</p>
                  <p className="text-sm text-muted-foreground">
                    Bắt buộc kiểm tra chất lượng trước khi xuất kho
                  </p>
                </div>
                <Switch 
                  checked={config.requireQualityCheck}
                  onCheckedChange={(checked) => setConfig({ ...config, requireQualityCheck: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tự động phân công sản xuất</p>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống tự động phân công công việc sản xuất theo lịch
                  </p>
                </div>
                <Switch 
                  checked={config.autoAssignProduction}
                  onCheckedChange={(checked) => setConfig({ ...config, autoAssignProduction: checked })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell size={18} />
              Cài đặt Thông báo
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo qua Email</p>
                  <p className="text-sm text-muted-foreground">
                    Gửi thông báo quan trọng qua email
                  </p>
                </div>
                <Switch 
                  checked={config.emailNotifications}
                  onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo đơn hàng mới</p>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi có đơn hàng mới
                  </p>
                </div>
                <Switch 
                  checked={config.orderNotifications}
                  onCheckedChange={(checked) => setConfig({ ...config, orderNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cảnh báo tồn kho thấp</p>
                  <p className="text-sm text-muted-foreground">
                    Nhận cảnh báo khi tồn kho dưới ngưỡng
                  </p>
                </div>
                <Switch 
                  checked={config.lowStockAlerts}
                  onCheckedChange={(checked) => setConfig({ ...config, lowStockAlerts: checked })}
                />
              </div>

              <div>
                <Label>Ngưỡng tồn kho thấp (%)</Label>
                <Input 
                  type="number"
                  className="mt-2 max-w-xs"
                  value={config.lowStockThreshold}
                  onChange={(e) => setConfig({ ...config, lowStockThreshold: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cảnh báo hết hạn</p>
                  <p className="text-sm text-muted-foreground">
                    Nhận cảnh báo khi nguyên liệu sắp hết hạn
                  </p>
                </div>
                <Switch 
                  checked={config.expiryAlerts}
                  onCheckedChange={(checked) => setConfig({ ...config, expiryAlerts: checked })}
                />
              </div>

              <div>
                <Label>Cảnh báo trước ngày hết hạn (ngày)</Label>
                <Input 
                  type="number"
                  className="mt-2 max-w-xs"
                  value={config.expiryAlertDays}
                  onChange={(e) => setConfig({ ...config, expiryAlertDays: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield size={18} />
              Cài đặt Bảo mật
            </h3>
            <div className="space-y-6">
              <div>
                <Label>Thời gian phiên đăng nhập (phút)</Label>
                <Input 
                  type="number"
                  className="mt-2 max-w-xs"
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Tự động đăng xuất sau thời gian không hoạt động
                </p>
              </div>

              <div>
                <Label>Số lần đăng nhập sai tối đa</Label>
                <Input 
                  type="number"
                  className="mt-2 max-w-xs"
                  value={config.maxLoginAttempts}
                  onChange={(e) => setConfig({ ...config, maxLoginAttempts: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Khóa tài khoản sau số lần nhập sai mật khẩu
                </p>
              </div>

              <div>
                <Label>Thời gian lưu trữ dữ liệu (ngày)</Label>
                <Input 
                  type="number"
                  className="mt-2 max-w-xs"
                  value={config.dataRetentionDays}
                  onChange={(e) => setConfig({ ...config, dataRetentionDays: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Dữ liệu lịch sử sẽ được lưu trữ trong thời gian này
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfig;
