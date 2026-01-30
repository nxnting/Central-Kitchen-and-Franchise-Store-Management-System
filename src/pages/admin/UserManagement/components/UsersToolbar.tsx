import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onRefresh: () => void | Promise<void>;
  loading?: boolean;
};

export const UsersToolbar: React.FC<Props> = ({ searchTerm, onSearchTermChange, onRefresh, loading }) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Tìm kiếm theo username/email/role..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button variant="outline" onClick={onRefresh} disabled={loading} className="gap-2">
        <RefreshCw size={16} />
        Refresh
      </Button>
    </div>
  );
};
