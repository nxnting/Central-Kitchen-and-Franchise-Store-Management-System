import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, Package, Truck, MessageSquare, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Exception {
  id: string;
  type: 'shortage' | 'delay' | 'quality' | 'cancellation';
  orderId: string;
  storeName: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

const mockExceptions: Exception[] = [
  {
    id: 'EXC-001',
    type: 'shortage',
    orderId: 'ORD-001',
    storeName: 'Downtown Branch',
    description: 'Insufficient stock of Pizza Base to fulfill order quantity',
    status: 'open',
    createdAt: '2024-01-15 10:30',
    priority: 'high',
  },
  {
    id: 'EXC-002',
    type: 'delay',
    orderId: 'ORD-002',
    storeName: 'Mall Outlet',
    description: 'Delivery delayed due to vehicle breakdown',
    status: 'in_progress',
    createdAt: '2024-01-15 08:00',
    priority: 'medium',
  },
  {
    id: 'EXC-003',
    type: 'quality',
    orderId: 'ORD-003',
    storeName: 'Airport Terminal',
    description: 'Store reported quality issue with Tomato Sauce batch',
    status: 'open',
    createdAt: '2024-01-14 16:00',
    priority: 'high',
  },
];

const ExceptionHandling: React.FC = () => {
  const [exceptions, setExceptions] = useState(mockExceptions);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [resolution, setResolution] = useState('');

  const getTypeIcon = (type: Exception['type']) => {
    switch (type) {
      case 'shortage': return <Package size={18} />;
      case 'delay': return <Truck size={18} />;
      case 'quality': return <AlertTriangle size={18} />;
      case 'cancellation': return <Clock size={18} />;
    }
  };

  const getTypeColor = (type: Exception['type']) => {
    switch (type) {
      case 'shortage': return 'text-warning bg-warning/10';
      case 'delay': return 'text-info bg-info/10';
      case 'quality': return 'text-destructive bg-destructive/10';
      case 'cancellation': return 'text-muted-foreground bg-muted';
    }
  };

  const handleResolve = () => {
    if (selectedException && resolution) {
      setExceptions(exceptions.map(e => 
        e.id === selectedException.id ? { ...e, status: 'resolved' as const } : e
      ));
      toast.success(`Exception ${selectedException.id} resolved`);
      setSelectedException(null);
      setResolution('');
    }
  };

  const openExceptions = exceptions.filter(e => e.status !== 'resolved');
  const resolvedExceptions = exceptions.filter(e => e.status === 'resolved');

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Exception Handling" 
        subtitle="Manage shortages, delays, and cancellations"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-destructive/10 rounded-xl border border-destructive/20 p-4">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">High Priority</span>
          </div>
          <p className="text-2xl font-semibold">
            {exceptions.filter(e => e.priority === 'high' && e.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-warning/10 rounded-xl border border-warning/20 p-4">
          <div className="flex items-center gap-2 text-warning mb-1">
            <Package size={18} />
            <span className="text-sm font-medium">Shortages</span>
          </div>
          <p className="text-2xl font-semibold">
            {exceptions.filter(e => e.type === 'shortage' && e.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-info/10 rounded-xl border border-info/20 p-4">
          <div className="flex items-center gap-2 text-info mb-1">
            <Truck size={18} />
            <span className="text-sm font-medium">Delays</span>
          </div>
          <p className="text-2xl font-semibold">
            {exceptions.filter(e => e.type === 'delay' && e.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-success/10 rounded-xl border border-success/20 p-4">
          <div className="flex items-center gap-2 text-success mb-1">
            <Check size={18} />
            <span className="text-sm font-medium">Resolved Today</span>
          </div>
          <p className="text-2xl font-semibold">{resolvedExceptions.length}</p>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="bg-card rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Open Exceptions ({openExceptions.length})</h2>
        </div>
        
        {openExceptions.length === 0 ? (
          <div className="p-12 text-center">
            <Check size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No open exceptions</p>
          </div>
        ) : (
          <div className="divide-y">
            {openExceptions.map((exception) => (
              <div key={exception.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(exception.type)}`}>
                  {getTypeIcon(exception.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{exception.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      exception.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                      exception.priority === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {exception.priority}
                    </span>
                    <StatusBadge status={exception.status === 'open' ? 'pending' : 'processing'} />
                  </div>
                  <p className="text-sm text-muted-foreground">{exception.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exception.storeName} • {exception.orderId} • {exception.createdAt}
                  </p>
                </div>
                
                <Button onClick={() => setSelectedException(exception)}>
                  <MessageSquare size={16} className="mr-1" />
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={!!selectedException} onOpenChange={() => setSelectedException(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Exception {selectedException?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedException && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Issue</p>
                <p>{selectedException.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Action</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="substitute">Substitute with alternative product</SelectItem>
                    <SelectItem value="reschedule">Reschedule delivery</SelectItem>
                    <SelectItem value="partial">Partial fulfillment</SelectItem>
                    <SelectItem value="refund">Issue refund/credit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  placeholder="Describe the resolution..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedException(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleResolve} disabled={!resolution}>
                  <Check size={16} className="mr-1" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExceptionHandling;
