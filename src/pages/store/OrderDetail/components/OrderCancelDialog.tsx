import React from "react";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCode: string;
  cancelReason: string;
  onCancelReasonChange: (reason: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const OrderCancelDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  orderCode,
  cancelReason,
  onCancelReasonChange,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) onCancelReasonChange("");
      }}
    >
      <DialogContent className="max-w-lg rounded-2xl shadow-2xl border-destructive/20 scale-in-center duration-300">
        <DialogHeader className="border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-destructive animate-pulse" />
            <DialogTitle className="text-xl">
              Hủy đơn hàng <span className="text-primary font-mono">{orderCode}</span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-destructive font-medium leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn này không? Hành động này sẽ gửi yêu cầu trực tiếp đến Bếp Trung Tâm và <strong className="underline underline-offset-4">không thể hoàn tác</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="cancelReason" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
              Lý do hủy đơn hàng <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancelReason"
              placeholder="Vui lòng nhập lý do cụ thể..."
              value={cancelReason}
              onChange={(e) => onCancelReasonChange(e.target.value)}
              className="resize-none focus:ring-destructive/30 border-muted-foreground/20 rounded-xl"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-6 rounded-lg hover:bg-muted duration-200"
            >
              Quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading || !cancelReason.trim()}
              className="px-8 rounded-lg shadow-lg shadow-destructive/20 font-bold hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancelDialog;
