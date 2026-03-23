import React, { useMemo } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ReceivingDetail } from "@/types/store/receiving.types";

import ReceivingInfoGrid from "./ReceivingInfoGrid";
import ReceivingItemsTable from "./ReceivingItemsTable";
import ConfirmReceivingSection from "./ConfirmReceivingSection";

type Props = {
  open: boolean;
  onClose: () => void;
  detail?: ReceivingDetail;
  isLoading: boolean;
  isError: boolean;
  note: string;
  onNoteChange: (value: string) => void;
  onConfirm: () => void;
  confirmLoading: boolean;
};

const ReceivingDetailModal: React.FC<Props> = ({
  open,
  onClose,
  detail,
  isLoading,
  isError,
  note,
  onNoteChange,
  onConfirm,
  confirmLoading,
}) => {
  if (!open) return null;

  const droppedCount = detail?.items.filter((i) => i.isDropped === true).length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Chi tiết nhận hàng
            {detail?.deliveryCode ? ` – ${detail.deliveryCode}` : ""}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !detail ? (
          <div className="p-4 text-center text-muted-foreground">Đang đóng...</div>
        ) : (
          <div className="space-y-5">
            {/* Drop warning banner — shown at top so user sees it immediately */}
            {droppedCount > 0 && (
              <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 px-4 py-3 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">
                    {droppedCount} sản phẩm không được giao trong chuyến này
                  </p>
                  <p className="text-sm text-destructive/80 mt-0.5">
                    Do tồn kho tại Bếp Trung Tâm không đủ. Cửa hàng vui lòng kiểm tra
                    danh sách bên dưới để biết sản phẩm nào bị ảnh hưởng.
                  </p>
                </div>
              </div>
            )}

            <ReceivingInfoGrid detail={detail} />
            <ReceivingItemsTable items={detail.items} />
            <ConfirmReceivingSection
              status={detail.status}
              note={note}
              onNoteChange={onNoteChange}
              onClose={onClose}
              onConfirm={onConfirm}
              confirmLoading={confirmLoading}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceivingDetailModal;