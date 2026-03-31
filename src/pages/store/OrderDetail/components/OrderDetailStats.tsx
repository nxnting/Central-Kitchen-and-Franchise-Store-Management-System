import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { StoreOrder } from "@/types/store/storeOrder.types";

interface Props {
  order: StoreOrder;
  helperText?: string;
  hasDroppedOrPartial: boolean;
  totalForwarded: number | null;
  totalRequested: number;
  totalDropped: number;
  formatDate: (val?: string | null) => string;
}

const OrderDetailStats: React.FC<Props> = ({
  order,
  helperText,
  hasDroppedOrPartial,
  totalForwarded,
  totalRequested,
  totalDropped,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
        <StatusBadge status={order.status} />
        {helperText && (
          <p className="text-xs text-blue-700 mt-2 italic">{helperText}</p>
        )}
      </div>

      <div className="bg-card border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">Ngày yêu cầu giao</p>
        <p className="font-semibold text-sm">
          {formatDate(order.requestedDeliveryDate || order.orderDate)}
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4 flex flex-col justify-between">
        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">
          Mặt hàng
        </p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{order.items.length}</p>
          {hasDroppedOrPartial && (
            <Badge
              variant="outline"
              className="text-[10px] text-amber-600 border-amber-200 bg-amber-50"
            >
              Thay đổi
            </Badge>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 flex flex-col justify-between">
        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">
          SL giao
        </p>
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          <p className="text-2xl font-bold text-primary truncate max-w-full">
            {totalForwarded ?? "-"}
          </p>
          {hasDroppedOrPartial && (
            <p className="text-[10px] text-muted-foreground shrink-0">
              / {totalRequested} đặt
            </p>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 flex flex-col justify-between">
        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider text-destructive">
          Bị hủy
        </p>
        <div className="flex items-end">
          <p
            className={`text-2xl font-bold ${
              totalDropped > 0 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {totalDropped}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailStats;
