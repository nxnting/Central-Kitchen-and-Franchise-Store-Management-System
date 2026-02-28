import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin } from 'lucide-react';
import type { AdminFranchise } from '@/types/admin/franchise.types';
import { useNavigate } from 'react-router-dom';

type Props = {
  items: AdminFranchise[];
  loading?: boolean;
  onEdit: (item: AdminFranchise) => void;
  onDelete: (id: number) => void | Promise<void>;
};

export const FranchisesGrid: React.FC<Props> = ({ items, loading, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (loading) return <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>;
  if (items.length === 0) return <div className="text-sm text-muted-foreground">Không có dữ liệu phù hợp.</div>;

  const goDetail = (id: number) => navigate(`/admin/franchises/${id}`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((f) => (
        <div
          key={f.franchiseId}
          className="bg-card border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-sm transition"
          onClick={() => goDetail(f.franchiseId)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') goDetail(f.franchiseId);
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                f.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}
            >
              {f.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'}
            </span>

            <span className="text-xs text-muted-foreground">ID: {f.franchiseId}</span>
          </div>

          <h3 className="font-semibold mb-2">{f.name}</h3>

          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <p className="flex items-center gap-2">
              <MapPin size={14} />
              {f.address}
            </p>
            <p>
              Khu vực: <span className="text-foreground">{f.location}</span>
            </p>
            <p>
              Loại: <span className="text-foreground">{f.type}</span>
            </p>
          </div>

          
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(f)}>
              <Edit size={14} className="mr-1" />
              Sửa
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(f.franchiseId)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};