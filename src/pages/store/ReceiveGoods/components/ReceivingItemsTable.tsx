import React from "react";
import { AlertTriangle, CheckCircle2, X, PackageCheck } from "lucide-react";

import type { ReceivingDetailItem } from "@/types/store/receiving.types";

type Props = {
  items: ReceivingDetailItem[];
};

const ItemTypeBadge = ({ type }: { type: string }) => (
  <span
    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
      type === "PRODUCT"
        ? "bg-blue-100 text-blue-700"
        : "bg-emerald-100 text-emerald-700"
    }`}
  >
    {type === "PRODUCT" ? "Thành phẩm" : "Nguyên liệu"}
  </span>
);

const ReceivingItemsTable: React.FC<Props> = ({ items }) => {
  const droppedItems = items.filter((i) => i.isDropped === true);
  const normalItems = items.filter((i) => i.isDropped !== true);

  return (
    <div className="space-y-5">
      {/* ⚠️ Dropped items section — shown prominently first */}
      {droppedItems.length > 0 && (
        <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 overflow-hidden">
          <div className="flex items-center gap-2 bg-destructive/10 px-4 py-3 border-b border-destructive/20">
            <AlertTriangle size={16} className="text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive text-sm">
                {droppedItems.length} sản phẩm bị hủy do thiếu tồn kho
              </p>
              <p className="text-xs text-destructive/80">
                Những sản phẩm này sẽ KHÔNG được giao trong chuyến này
              </p>
            </div>
          </div>

          <div className="divide-y divide-destructive/10">
            {droppedItems.map((item) => (
              <div
                key={`${item.itemType}-${item.itemId}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/15 flex items-center justify-center">
                  <X size={16} className="text-destructive" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm line-through text-muted-foreground">
                      {item.itemName}
                    </p>
                    <ItemTypeBadge type={item.itemType} />
                  </div>
                  {item.dropReason && (
                    <p className="text-xs text-destructive">
                      Lý do: {item.dropReason}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground line-through">
                    {item.expectedQuantity ?? item.deliveredQuantity} {item.unit}
                  </p>
                  <p className="text-sm font-bold text-destructive">Không giao</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normal / delivered items */}
      <div>
        <h4 className="mb-3 font-semibold flex items-center gap-2">
          <PackageCheck size={16} className="text-green-600" />
          Hàng được giao
          <span className="text-sm font-normal text-muted-foreground">
            ({normalItems.length} sản phẩm)
          </span>
        </h4>

        {normalItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Không có sản phẩm nào được giao.
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Tên mặt hàng</th>
                  <th className="px-3 py-2.5 text-left font-medium">Loại</th>
                  <th className="px-3 py-2.5 text-center font-medium">SL đặt</th>
                  <th className="px-3 py-2.5 text-center font-medium">SL giao</th>
                  <th className="px-3 py-2.5 text-center font-medium">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {normalItems.map((item) => {
                  const hasDiscrepancy =
                    item.expectedQuantity != null &&
                    item.deliveredQuantity !== item.expectedQuantity;

                  return (
                    <tr
                      key={`${item.itemType}-${item.itemId}`}
                      className={[
                        "border-b last:border-0",
                        hasDiscrepancy ? "bg-yellow-50" : "hover:bg-muted/10",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 font-medium">{item.itemName}</td>
                      <td className="px-3 py-3">
                        <ItemTypeBadge type={item.itemType} />
                      </td>
                      <td className="px-3 py-3 text-center text-muted-foreground">
                        {item.expectedQuantity ?? "-"}{" "}
                        <span className="text-xs">{item.unit}</span>
                      </td>
                      <td
                        className={`px-3 py-3 text-center font-semibold ${
                          hasDiscrepancy ? "text-yellow-700" : "text-green-700"
                        }`}
                      >
                        {item.deliveredQuantity}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {hasDiscrepancy ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle size={10} />
                            Giao thiếu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 size={10} />
                            Đủ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivingItemsTable;