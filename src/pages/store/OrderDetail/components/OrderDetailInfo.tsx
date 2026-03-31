import React from "react";
import type { StoreOrder } from "@/types/store/storeOrder.types";

interface Props {
  order: StoreOrder;
  orderCode: string;
  formatDateTime: (val?: string | null) => string;
}

const OrderDetailInfo: React.FC<Props> = ({ order, orderCode, formatDateTime }) => {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold mb-4 pb-2 border-b">
        Thông tin đơn hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center group">
            <span className="text-muted-foreground">Mã đơn</span>
            <span className="font-semibold text-primary">{orderCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ngày tạo</span>
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Cập nhật lần cuối</span>
            <span>{formatDateTime(order.updatedAt)}</span>
          </div>
          {order.processingNote && (
            <div className="flex justify-between gap-4 pt-2">
              <span className="text-muted-foreground shrink-0 text-xs uppercase tracking-wider font-bold">
                Ghi chú bộ phận xử lý
              </span>
              <span className="text-right italic text-muted-foreground">
                {order.processingNote}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Đã gửi lúc</span>
            <span>{formatDateTime(order.submittedAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Đã chuyển Cung ứng</span>
            <span>{formatDateTime(order.forwardedAt)}</span>
          </div>
          {order.forwardNote && (
            <div className="flex justify-between gap-4 pt-2 border-t mt-2">
              <span className="text-muted-foreground shrink-0 text-xs uppercase tracking-wider font-bold">
                Ghi chú giao nhận
              </span>
              <span className="text-right text-muted-foreground">
                {order.forwardNote}
              </span>
            </div>
          )}
          {order.cancelReason && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 border border-destructive/20 animate-in zoom-in-95 duration-200">
              <p className="text-[10px] text-destructive uppercase font-bold tracking-wider mb-1">
                Lý do hủy đơn
              </p>
              <p className="text-destructive font-medium leading-relaxed">
                {order.cancelReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailInfo;
