import React from 'react';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE' | string;
  activeLabel?: string;
  inactiveLabel?: string;
}

/**
 * Reusable status badge component for ACTIVE/INACTIVE states
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  activeLabel = 'Đang hoạt động', 
  inactiveLabel = 'Ngưng hoạt động' 
}) => {
  const isActive = status === 'ACTIVE';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }`}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};

export default StatusBadge;
