import React from "react";
import { FlaskConical } from "lucide-react";
import type { StoreOrderIngredientItem } from "@/types/store/storeOrder.types";

interface Props {
  ingredientItems: StoreOrderIngredientItem[];
  isItemDropped: (item: StoreOrderIngredientItem) => boolean;
  isItemPartial: (item: StoreOrderIngredientItem) => boolean;
}

const OrderDetailIngredientTable: React.FC<Props> = ({
  ingredientItems,
  isItemDropped,
  isItemPartial,
}) => {
  if (ingredientItems.length === 0) return null;

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
      <div className="p-4 border-b bg-blue-50/50 flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2 text-blue-700">
          <FlaskConical size={18} />
          Danh sách nguyên liệu
        </h2>
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
          {ingredientItems.length} loại
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-700 border-b border-blue-100">
            <div className="col-span-1 text-center font-mono opacity-60">#</div>
            <div className="col-span-6">Nguyên liệu</div>
            <div className="col-span-2 text-center border-l border-blue-200/50 bg-white/20">SL đặt</div>
            <div className="col-span-3 text-center border-l border-blue-200/50 bg-white/20 font-bold uppercase tracking-widest">SL giao</div>
          </div>
          <div className="divide-y divide-blue-100/50">
            {ingredientItems.map((item, index) => {
              const dropped = isItemDropped(item);
              const partial = isItemPartial(item);
              return (
                <div
                  key={item.ingredientId}
                  className={[
                    "grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center transition-all duration-200 group",
                    dropped
                      ? "bg-red-50/40 hover:bg-red-50/60"
                      : partial
                      ? "bg-amber-50/40 hover:bg-amber-100/50"
                      : "hover:bg-blue-50/20",
                  ].join(" ")}
                >
                  <div className="col-span-1 text-center text-muted-foreground font-mono text-xs opacity-50">
                    {index + 1}
                  </div>
                  <div className="col-span-6">
                    <p
                      className={`font-medium ${
                        dropped ? "line-through text-muted-foreground opacity-70" : ""
                      }`}
                    >
                      {item.ingredientName}
                    </p>
                    {item.dropReason && (
                      <div className="mt-1 flex items-start gap-1 p-1 rounded bg-red-50/50 border border-red-100/30">
                        <p className="text-[10px] text-red-600 leading-tight italic">
                          {item.dropReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-center text-muted-foreground group-hover:text-foreground transition-colors border-l border-blue-100/30">
                    <span className="font-semibold text-xs">{item.quantity}</span>{" "}
                    <span className="text-[10px] opacity-70 uppercase">{item.unit}</span>
                  </div>
                  <div className="col-span-3 text-center font-bold border-l border-blue-100/30">
                    {typeof item.forwardedQuantity === "number" ? (
                      item.forwardedQuantity === 0 && dropped ? (
                        <span className="text-destructive inline-flex items-center gap-1.5 px-2 bg-destructive/5 rounded border border-destructive/10">
                          0 {item.unit}
                        </span>
                      ) : item.forwardedQuantity < item.quantity ? (
                        <span className="text-amber-700 inline-flex items-center gap-1.5 px-2 bg-amber-50 rounded border border-amber-200/50">
                          {item.forwardedQuantity} {item.unit}
                        </span>
                      ) : (
                        <span className="text-emerald-700 inline-flex items-center gap-1.5 px-2 bg-emerald-50 rounded border border-emerald-200/50">
                          {item.forwardedQuantity} {item.unit}
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground/40 italic font-normal text-xs animate-pulse">
                        Chưa giao...
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

export default OrderDetailIngredientTable;
