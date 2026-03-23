import React from "react";
import { ClipboardList, Package, Truck, Calendar, ChevronRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { PendingReceivingItem } from "@/types/store/receiving.types";

type Props = {
  receiving: PendingReceivingItem;
  onOpen: () => void;
};

const ReceivingCard: React.FC<Props> = ({ receiving, onOpen }) => {
  const isDelivered = receiving.status === "DELIVERED";
  const isReceived = receiving.status === "RECEIVED_BY_STORE";

  return (
    <div
      className={[
        "rounded-xl border bg-card p-5 shadow-sm transition-all",
        isReceived
          ? "opacity-60"
          : "hover:shadow-md hover:border-primary/40 cursor-pointer",
      ].join(" ")}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <div>
          <span className="text-base font-bold">{receiving.deliveryCode}</span>
          {receiving.orderCode && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đơn: {receiving.orderCode}
            </p>
          )}
        </div>
        <StatusBadge status={receiving.status} />
      </div>

      {/* Info rows */}
      <div className="mb-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Package size={13} />
            Tổng hàng
          </span>
          <span className="font-medium">
            {receiving.totalItems} món
            <span className="text-muted-foreground ml-1">(SL: {receiving.totalQuantity})</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={13} />
            Ngày giao kế hoạch
          </span>
          <span>{receiving.planDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ClipboardList size={13} />
            Bếp Trung Tâm
          </span>
          <span
            className="max-w-[160px] truncate text-right font-medium"
            title={receiving.centralKitchenName}
          >
            {receiving.centralKitchenName}
          </span>
        </div>
      </div>

      {/* Status hint */}
      {isDelivered && !isReceived && (
        <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700 flex items-center gap-1.5">
          <Truck size={12} />
          Hàng đã tới — nhấn để xác nhận nhận hàng
        </div>
      )}

      <Button
        className="w-full"
        variant={isReceived ? "outline" : "default"}
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
      >
        {isReceived ? "Xem chi tiết" : "Chi tiết & Nhận hàng"}
        <ChevronRight size={16} className="ml-auto" />
      </Button>
    </div>
  );
};

export default ReceivingCard;