import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockDeliveries, DeliverySchedule } from '@/data/mockData';
import { Truck, MapPin, Clock, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const DeliveryTracking: React.FC = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries);

  const handleMarkDelivered = (deliveryId: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? { ...d, status: 'delivered' as const } : d
    ));
    toast.success('Delivery marked as completed');
  };

  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'scheduled');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Delivery Tracking" 
        subtitle="Track deliveries in real-time"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Deliveries */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Active Deliveries ({activeDeliveries.length})</h2>
          {activeDeliveries.length === 0 ? (
            <div className="bg-card rounded-xl border p-12 text-center">
              <Truck size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active deliveries</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-card rounded-xl border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{delivery.id}</span>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">Order: {delivery.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{delivery.driver}</p>
                      <p className="text-sm text-muted-foreground">{delivery.vehicle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="text-sm">{delivery.storeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm">{delivery.scheduledTime}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Central Kitchen</span>
                      <span>{delivery.storeName}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          delivery.status === 'in_transit' ? 'bg-info w-1/2' : 'bg-muted-foreground w-0'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw size={14} className="mr-1" />
                      Refresh
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleMarkDelivered(delivery.id)}>
                      <Check size={14} className="mr-1" />
                      Mark Delivered
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Today */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed Today ({completedDeliveries.length})</h2>
          <div className="space-y-3">
            {completedDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-card rounded-xl border p-4 opacity-75">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{delivery.storeName}</span>
                  <StatusBadge status={delivery.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{delivery.scheduledTime} • {delivery.driver}</p>
                </div>
              </div>
            ))}
            {completedDeliveries.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No completed deliveries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
