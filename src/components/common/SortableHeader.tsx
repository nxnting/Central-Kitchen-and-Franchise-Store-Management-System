import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentField: string;
  currentOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  className?: string;
}

/**
 * Reusable sortable table header component
 */
export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentField,
  currentOrder,
  onSort,
  className = ''
}) => {
  const getSortIcon = () => {
    if (currentField !== field) {
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    }
    return currentOrder === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div 
      className={`flex items-center cursor-pointer select-none ${className}`}
      onClick={() => onSort(field)}
    >
      {label}
      {getSortIcon()}
    </div>
  );
};

export default SortableHeader;
