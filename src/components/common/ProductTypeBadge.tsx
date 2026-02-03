import React from 'react';

interface ProductTypeBadgeProps {
  type: 'FINISHED' | 'SEMI_FINISHED' | string;
}

const LABELS: Record<string, string> = {
  FINISHED: 'Thành phẩm',
  SEMI_FINISHED: 'Bán thành phẩm',
};

/**
 * Reusable product type badge component
 */
export const ProductTypeBadge: React.FC<ProductTypeBadgeProps> = ({ type }) => {
  const isFinished = type === 'FINISHED';
  const label = LABELS[type] || type;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isFinished 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    }`}>
      {label}
    </span>
  );
};

export const getProductTypeLabel = (type: string): string => {
  return LABELS[type] || type;
};

export default ProductTypeBadge;
