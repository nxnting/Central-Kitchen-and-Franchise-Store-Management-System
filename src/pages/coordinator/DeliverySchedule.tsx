import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockDeliveries, DeliverySchedule } from '@/data/mockData';
import { Plus, Calendar, Truck, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const DeliveryScheduleView: React.FC = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries);

  const groupedByDate = deliveries.reduce((acc, delivery) => {
    if (!acc[delivery.scheduledDate]) {
      acc[delivery.scheduledDate] = [];
    }
    acc[delivery.scheduledDate].push(delivery);
    return acc;
  }, {} as Record<string, DeliverySchedule[]>);

  const handleDispatch = (deliveryId: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? { ...d, status: 'in_transit' as const } : d
    ));
    toast.success('Delivery dispatched successfully');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Lịch Giao hàng" 
        subtitle="Lập kế hoạch và quản lý lịch giao hàng"
        action={
          <Button onClick={() => toast.info('Tạo lịch giao hàng mới')}>
            <Plus size={16} className="mr-2" />
            Tạo lịch mới
          </Button>
        }
      />

      {/* Timeline View */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).sort().map(([date, dateDeliveries]) => (
          <div key={date} className="bg-card rounded-xl border overflow-hidden">
            <div className="bg-muted/50 px-6 py-3 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-semibold">{date}</span>
              <span className="text-sm text-muted-foreground">
                ({dateDeliveries.length} deliveries)
              </span>
            </div>
            
            <div className="divide-y">
              {dateDeliveries.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)).map((delivery) => (
                <div key={delivery.id} className="p-4 flex items-center gap-4">
                  <div className="w-20 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      <span className="font-medium">{delivery.scheduledTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="font-medium">{delivery.storeName}</span>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order: {delivery.orderId}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck size={16} className="text-muted-foreground" />
                      <span>{delivery.vehicle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Driver: {delivery.driver}
                    </p>
                  </div>
                  
                  <div>
                    {delivery.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleDispatch(delivery.id)}>
                        Dispatch
                      </Button>
                    )}
                    {delivery.status === 'in_transit' && (
                      <Button size="sm" variant="outline" disabled>
                        In Transit
                      </Button>
                    )}
                    {delivery.status === 'delivered' && (
                      <Button size="sm" variant="ghost" disabled>
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryScheduleView;
