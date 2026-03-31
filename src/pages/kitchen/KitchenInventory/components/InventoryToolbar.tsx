import React from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KitchenInventoryTab } from "@/types/kitchen/inventoryBatch.types";

type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: KitchenInventoryTab;
  selectedItemId: string;
  onSelectedItemIdChange: (value: string) => void;
  filterOptions: FilterOption[];
  onCreateInbound: () => void;
  onRefresh: () => unknown;
  refreshing?: boolean;
};

const InventoryToolbar: React.FC<Props> = ({
  search,
  onSearchChange,
  activeTab,
  selectedItemId,
  onSelectedItemIdChange,
  filterOptions,
  onCreateInbound,
  onRefresh,
  refreshing = false,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm theo tên mặt hàng, mã lô, đơn vị..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full lg:w-[280px]">
          <Select
            value={selectedItemId}
            onValueChange={onSelectedItemIdChange}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  activeTab === "INGREDIENT"
                    ? "Lọc theo nguyên liệu"
                    : "Lọc theo sản phẩm"
                }
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">Tất cả mặt hàng</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => void onRefresh()}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>

        <Button type="button" onClick={onCreateInbound}>
          <Plus size={16} className="mr-2" />
          {activeTab === "INGREDIENT"
            ? "Nhập lô nguyên liệu"
            : "Nhập lô sản phẩm"}
        </Button>
      </div>
    </div>
  );
};

export default InventoryToolbar;