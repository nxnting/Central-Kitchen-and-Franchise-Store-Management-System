import React from 'react';

type Status = 'pending' | 'processing' | 'delivered' | 'cancelled' | 'scheduled' | 'in_transit' | 'delayed' | 'planned' | 'in_progress' | 'completed' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-badge status-pending' },
  processing: { label: 'Processing', className: 'status-badge status-processing' },
  delivered: { label: 'Delivered', className: 'status-badge status-delivered' },
  cancelled: { label: 'Cancelled', className: 'status-badge status-cancelled' },
  scheduled: { label: 'Scheduled', className: 'status-badge status-processing' },
  in_transit: { label: 'In Transit', className: 'status-badge status-processing' },
  delayed: { label: 'Delayed', className: 'status-badge status-pending' },
  planned: { label: 'Planned', className: 'status-badge status-pending' },
  in_progress: { label: 'In Progress', className: 'status-badge status-processing' },
  completed: { label: 'Completed', className: 'status-badge status-delivered' },
  active: { label: 'Active', className: 'status-badge status-delivered' },
  inactive: { label: 'Inactive', className: 'status-badge status-cancelled' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  
  return (
    <span className={`${config.className} ${className}`}>
      {config.label}
    </span>
  );
};
