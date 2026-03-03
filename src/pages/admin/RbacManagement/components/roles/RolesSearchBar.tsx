// src/pages/admin/RbacManagement/components/roles/RolesSearchBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";
import PanelCard from "../layout/PanelCard";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRefresh: () => void | Promise<void>;
  loading?: boolean;
};

const RolesSearchBar: React.FC<Props> = ({ value, onChange, onRefresh, loading }) => {
  return (
    <PanelCard className="p-3">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm vai trò..."
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRefresh()}
          disabled={!!loading}
          title="Refresh"
        >
          <RefreshCcw size={16} />
        </Button>
      </div>
    </PanelCard>
  );
};

export default RolesSearchBar;