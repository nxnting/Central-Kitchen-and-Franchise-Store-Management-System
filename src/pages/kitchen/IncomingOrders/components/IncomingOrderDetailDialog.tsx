import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";

import type { IncomingOrder } from "@/types/kitchen/incomingOrder.types";
import {
  formatDate,
  formatDateTime,
  getOrderDisplayCode,
  getOrderTimeline,
  getOrderTotalQuantity,
} from "../helpers";

type Props = {
  order: IncomingOrder | null;
  open: boolean;
  onClose: () => void;
};

const IncomingOrderDetailDialog: React.FC<Props> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

  const timeline = getOrderTimeline(order);
  const totalQty = getOrderTotalQuantity(order);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Order {getOrderDisplayCode(order)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* META */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Store</p>
              <p className="font-medium">{order.franchiseName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <StatusBadge status={order.status} />
            </div>

            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Created</p>
              <p>{formatDateTime(order.createdAt)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p>{formatDateTime(order.submittedAt)}</p>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="border-t pt-4">
            <p className="font-medium mb-3">Timeline</p>

            <div className="space-y-2 text-sm">
              {timeline.map((t) => (
                <div
                  key={t.key}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                >
                  <span className="text-muted-foreground">{t.label}</span>
                  <span>{formatDateTime(t.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ITEMS */}
          <div className="border-t pt-4">
            <p className="font-medium mb-3">Order Items</p>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30"
                >
                  <span className="font-medium">{item.productName}</span>
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="border-t pt-4 flex items-center justify-between font-semibold">
            <span>Total Quantity</span>
            <span>{totalQty}</span>
          </div>

          {/* CANCEL REASON */}
          {order.cancelReason && (
            <div className="border-t pt-4 text-sm">
              <p className="text-muted-foreground mb-1">Cancel Reason</p>
              <p className="text-destructive font-medium">
                {order.cancelReason}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingOrderDetailDialog;
