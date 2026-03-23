import React from "react";

import { StatusBadge } from "@/components/ui/StatusBadge";

import type { ReceivingDetail } from "@/types/store/receiving.types";

type Props = {
  detail: ReceivingDetail;
};

const formatDate = (value?: string | null) => {
  if (!value) return "Chưa có";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(d);
};

const ReceivingInfoGrid: React.FC<Props> = ({ detail }) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-muted/20 border p-4 text-sm">
      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Bếp cung cấp</p>
        <p className="font-semibold">{detail.centralKitchenName}</p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Trạng thái</p>
        <StatusBadge status={detail.status} />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Ngày giao kế hoạch</p>
        <p className="font-medium">{detail.planDate || "Chưa có"}</p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Thực tế giao hàng</p>
        <p className="font-medium">{formatDate(detail.deliveryDate)}</p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Mã vận chuyển</p>
        <p className="font-semibold">{detail.deliveryCode}</p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Mã đơn liên kết</p>
        <p className="font-medium">{detail.orderCode || "Không có"}</p>
      </div>

      {detail.note && (
        <div className="col-span-2">
          <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">Ghi chú</p>
          <p className="text-muted-foreground italic">"{detail.note}"</p>
        </div>
      )}
    </div>
  );
};

export default ReceivingInfoGrid;