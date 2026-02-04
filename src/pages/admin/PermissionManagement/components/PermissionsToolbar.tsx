import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onRefresh: () => void | Promise<void>;
  onCreate: () => void;
  loading?: boolean;
};

export const PermissionsToolbar: React.FC<Props> = ({
  searchTerm,
  onSearchTermChange,
  onRefresh,
  onCreate,
  loading,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Tìm theo code / mô tả / nhóm..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={loading} className="gap-2">
          <RefreshCw size={16} />
          Refresh
        </Button>

        <Button onClick={onCreate} disabled={loading} className="gap-2">
          <Plus size={16} />
          Thêm quyền
        </Button>
      </div>
    </div>
  );
};

export default PermissionsToolbar;
