import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockProductionPlans, ProductionPlan } from '@/data/mockData';
import { Play, Check, Pause, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ProductionPlanning: React.FC = () => {
  const [plans, setPlans] = useState(mockProductionPlans);

  const handleStatusChange = (planId: string, newStatus: ProductionPlan['status']) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, status: newStatus } : p
    ));
    const statusMessages = {
      'in_progress': 'Đã bắt đầu sản xuất',
      'completed': 'Đã hoàn thành sản xuất',
      'planned': 'Đã tạm dừng sản xuất',
    };
    toast.success(statusMessages[newStatus]);
  };

  const groupedPlans = {
    planned: plans.filter(p => p.status === 'planned'),
    in_progress: plans.filter(p => p.status === 'in_progress'),
    completed: plans.filter(p => p.status === 'completed'),
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Kế hoạch Sản xuất" 
        subtitle="Lập kế hoạch và quản lý tiến độ sản xuất"
        action={
          <Button onClick={() => toast.info('Tạo kế hoạch sản xuất mới')}>
            <Plus size={16} className="mr-2" />
            Tạo kế hoạch mới
          </Button>
        }
      />

      {/* Date Selection */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2">
          <Calendar size={18} className="text-muted-foreground" />
          <span className="font-medium">16 tháng 1, 2024</span>
        </div>
        <Button variant="outline" size="sm">Ngày trước</Button>
        <Button variant="outline" size="sm">Ngày sau</Button>
      </div>

      {/* Kanban-style Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Planned */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <h3 className="font-semibold">Đã lên kế hoạch</h3>
            <span className="text-sm text-muted-foreground">({groupedPlans.planned.length})</span>
          </div>
          <div className="space-y-3">
            {groupedPlans.planned.map((plan) => (
              <div key={plan.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{plan.productName}</span>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {plan.quantity} {plan.unit} • {plan.assignedTo}
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleStatusChange(plan.id, 'in_progress')}
                >
                  <Play size={14} className="mr-1" />
                  Bắt đầu sản xuất
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-info/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-info" />
            <h3 className="font-semibold">Đang sản xuất</h3>
            <span className="text-sm text-muted-foreground">({groupedPlans.in_progress.length})</span>
          </div>
          <div className="space-y-3">
            {groupedPlans.in_progress.map((plan) => (
              <div key={plan.id} className="bg-card rounded-lg border border-info/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{plan.productName}</span>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {plan.quantity} {plan.unit} • {plan.assignedTo}
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(plan.id, 'planned')}
                  >
                    <Pause size={14} className="mr-1" />
                    Tạm dừng
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStatusChange(plan.id, 'completed')}
                  >
                    <Check size={14} className="mr-1" />
                    Hoàn thành
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-success/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-success" />
            <h3 className="font-semibold">Hoàn thành</h3>
            <span className="text-sm text-muted-foreground">({groupedPlans.completed.length})</span>
          </div>
          <div className="space-y-3">
            {groupedPlans.completed.map((plan) => (
              <div key={plan.id} className="bg-card rounded-lg border border-success/30 p-4 opacity-80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{plan.productName}</span>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.quantity} {plan.unit} • {plan.assignedTo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanning;
