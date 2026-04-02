import React from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import type { StoreOrder, StoreOrderItem } from "@/types/store/storeOrder.types";

interface Props {
  items: StoreOrderItem[];
  isItemDropped: (item: StoreOrderItem) => boolean;
  isItemPartial: (item: StoreOrderItem) => boolean;
}

const OrderDetailProductTable: React.FC<Props> = ({
  items,
  isItemDropped,
  isItemPartial,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground italic">
        Đơn hàng không có sản phẩm nào.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <h2 className="text-base font-semibold">Danh sách sản phẩm</h2>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          {items.length} món
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Sản phẩm</div>
            <div className="col-span-2 text-center border-l bg-white/50">SL đặt</div>
            <div className="col-span-2 text-center border-l bg-white/50">SL chốt</div>
            <div className="col-span-2 text-center border-l bg-white/50">Trạng thái</div>
          </div>
          <div className="divide-y divide-border/50">
            {items.map((item, index) => {
              const dropped = isItemDropped(item);
              const partial = isItemPartial(item);
              return (
                <div
                  key={item.productId}
                  className={[
                    "grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center transition-all duration-200 group",
                    dropped
                      ? "bg-destructive/5 hover:bg-destructive/10"
                      : partial
                      ? "bg-amber-50/50 hover:bg-amber-100/50"
                      : "hover:bg-muted/30",
                  ].join(" ")}
                >
                  <div className="col-span-1 text-center text-muted-foreground font-mono text-xs">
                    {index + 1}
                  </div>
                  <div className="col-span-5">
                    <p
                      className={`font-medium ${
                        dropped ? "line-through text-muted-foreground opacity-70" : ""
                      }`}
                    >
                      {item.productName}
                    </p>
                    {item.sku && (
                      <p className="text-[10px] text-muted-foreground font-mono">
                        SKU: {item.sku}
                      </p>
                    )}
                    {item.dropReason && (
                      <div className="mt-1 flex items-start gap-1.5 p-1.5 rounded-md bg-destructive/5 border border-destructive/10">
                        <X size={10} className="text-destructive shrink-0 mt-0.5" />
                        <p className="text-[10px] text-destructive leading-tight italic">
                          {item.dropReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-center border-l border-white/50 bg-white/10 group-hover:bg-white/20">
                    <span className="font-semibold">{item.quantity}</span>{" "}
                    <span className="text-muted-foreground text-[10px] uppercase">
                      {item.unit}
                    </span>
                  </div>
                  <div className="col-span-2 text-center border-l border-white/50 bg-white/10 group-hover:bg-white/20 font-bold">
                    {typeof item.forwardedQuantity === "number" ? (
                      item.forwardedQuantity === 0 && dropped ? (
                        <span className="text-destructive">0 {item.unit}</span>
                      ) : item.forwardedQuantity < item.quantity ? (
                        <span className="text-amber-700">
                          {item.forwardedQuantity} {item.unit}
                        </span>
                      ) : (
                        <span className="text-emerald-700">
                          {item.forwardedQuantity} {item.unit}
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground italic font-normal text-xs opacity-50">
                        Chờ...
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center border-l border-white/50 bg-white/10 group-hover:bg-white/20">
                    {dropped ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-destructive/10 text-destructive border border-destructive/20 scale-95 origin-center">
                        Bị hủy
                      </span>
                    ) : partial ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-amber-100 text-amber-800 border border-amber-200 scale-95 origin-center">
                        Một phần
                      </span>
                    ) : typeof item.forwardedQuantity === "number" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-emerald-100 text-emerald-800 border border-emerald-200 scale-95 origin-center">
                        Đã xác nhận
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground opacity-50 uppercase tracking-widest">
                        Chưa xử lý
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailProductTable;
