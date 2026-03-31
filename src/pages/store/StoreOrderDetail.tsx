import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  XCircle,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";

import { useStoreOrderDetail } from "@/hooks/storeOrders/useStoreOrderDetail";
import { useSubmitStoreOrder } from "@/hooks/storeOrders/useSubmitStoreOrder";
import { useCancelStoreOrder } from "@/hooks/storeOrders/useCancelStoreOrder";
import type { StoreOrder } from "@/types/store/storeOrder.types";

import StoreOrderProgress from "./CreateOrder/components/StoreOrderProgress";

// Sub-components
import OrderDetailStats from "./OrderDetail/components/OrderDetailStats";
import OrderDetailInfo from "./OrderDetail/components/OrderDetailInfo";
import OrderDetailProductTable from "./OrderDetail/components/OrderDetailProductTable";
import OrderDetailIngredientTable from "./OrderDetail/components/OrderDetailIngredientTable";
import OrderCancelDialog from "./OrderDetail/components/OrderCancelDialog";

const DELIVERY_STATUS_HELPER: Record<string, string> = {
  FORWARDED_TO_SUPPLY: "Đơn hàng đã được chuyển sang bộ phận Cung ứng để xử lý.",
  PREPARING: "Đơn hàng đang được chuẩn bị tại Bếp Trung Tâm.",
  READY_TO_DELIVER: "Đơn hàng đã sẵn sàng và đang chờ giao đến cửa hàng.",
  IN_TRANSIT: "Đơn hàng hiện đang trên đường giao đến cửa hàng.",
  DELIVERED: "Đơn hàng đã giao đến cửa hàng. Vui lòng xác nhận nhận hàng.",
  RECEIVED_BY_STORE: "Cửa hàng đã xác nhận nhận hàng thành công.",
};

const getCurrentFranchiseId = () => {
  const keys = ["franchiseId", "selectedFranchiseId", "currentFranchiseId"];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && !Number.isNaN(Number(v))) return Number(v);
  }
  return 0;
};

const getOrderCode = (order: StoreOrder) =>
  order.orderCode || `SO-${String(order.storeOrderId).padStart(6, "0")}`;

const isItemPartial = (item: any) =>
  typeof item.forwardedQuantity === "number" &&
  item.forwardedQuantity > 0 &&
  item.forwardedQuantity < item.quantity;

const isItemDropped = (item: any) =>
  item.isDroppedFromForward === true && (item.forwardedQuantity === 0 || item.forwardedQuantity == null);

const StoreOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const franchiseId = getCurrentFranchiseId();
  const { orderId, storeId } = useParams();

  const parsedOrderId = orderId ? Number(orderId) : 0;
  const resolvedStoreId = storeId ?? String(franchiseId);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    data: detailResponse,
    isLoading,
    isError,
    refetch,
  } = useStoreOrderDetail(franchiseId, parsedOrderId);

  const submitOrder = useSubmitStoreOrder(franchiseId);
  const cancelOrder = useCancelStoreOrder(franchiseId);

  const order = detailResponse?.data;

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(date);
  };

  const getTotalRequested = (order: StoreOrder) => {
    if (!order || !order.items) return 0;
    const productsVal = order.items.reduce((s, i) => s + i.quantity, 0);
    const ingredientsVal = (order.ingredientItems ?? []).reduce((s, i) => s + i.quantity, 0);
    return order.totalQuantity ?? (productsVal + ingredientsVal);
  };

  const getTotalForwarded = (order: StoreOrder) => {
    if (!order || !order.items) return null;
    if (order.status === "DRAFT" || order.status === "SUBMITTED") return null;
    if (order.forwardedTotalQuantity != null) return order.forwardedTotalQuantity;
    const productsVal = order.items.reduce((s, i) => s + (i.forwardedQuantity ?? i.quantity), 0);
    const ingredientsVal = (order.ingredientItems ?? []).reduce((s, i) => s + (i.forwardedQuantity ?? i.quantity), 0);
    return productsVal + ingredientsVal;
  };

  const getTotalDropped = (order: StoreOrder) => {
    if (!order || !order.items) return 0;
    if (order.droppedTotalQuantity != null) return order.droppedTotalQuantity;
    const productsVal = order.items.reduce((s, i) => s + (i.droppedQuantity ?? 0), 0);
    const ingredientsVal = (order.ingredientItems ?? []).reduce((s, i) => s + (i.droppedQuantity ?? 0), 0);
    return productsVal + ingredientsVal;
  };

  const droppedItems = useMemo(() => {
    const products = order?.items.filter(isItemDropped) ?? [];
    const ingredients = (order?.ingredientItems ?? []).filter(isItemDropped as any);
    return [...products, ...ingredients];
  }, [order]);

  const partialItems = useMemo(() => {
    const products = order?.items.filter(isItemPartial) ?? [];
    const ingredients = (order?.ingredientItems ?? []).filter(isItemPartial as any);
    return [...products, ...ingredients];
  }, [order]);

  const totalForwarded = order ? getTotalForwarded(order) : null;
  const totalRequested = order ? getTotalRequested(order) : 0;
  const totalDropped = order ? getTotalDropped(order) : 0;

  const hasDroppedOrPartial = droppedItems.length > 0 || partialItems.length > 0 || (order && (totalForwarded ?? 0) < (totalRequested ?? 0));

  const canSubmit = !!order && order.status === "DRAFT";
  const isCommitted = !!order && !["DRAFT", "SUBMITTED", "FORWARDED_TO_SUPPLY"].includes(order.status);
  const canCancel = !!order && (order.status === "DRAFT" || order.status === "SUBMITTED" || order.status === "FORWARDED_TO_SUPPLY") && !isCommitted;

  const handleSubmitOrder = async () => {
    if (!order) return;
    try {
      await submitOrder.mutateAsync(order.storeOrderId);
      toast.success(`Đã gửi đơn ${getOrderCode(order)}`);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Gửi đơn thất bại");
    }
  };

  const handleConfirmCancel = async () => {
    if (!order) return;
    const reason = cancelReason.trim();
    if (!reason) {
      toast.error("Vui lòng nhập lý do hủy đơn");
      return;
    }
    try {
      await cancelOrder.mutateAsync({ orderId: order.storeOrderId, payload: { reason } });
      toast.success(`Đã hủy đơn ${getOrderCode(order)}`);
      setCancelOpen(false);
      setCancelReason("");
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Hủy đơn thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Chi tiết đơn hàng" subtitle="Đang tải..." />
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Chi tiết đơn hàng" subtitle="Không thể tải thông tin" />
        <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm border-destructive/20">
          <p className="text-sm text-muted-foreground">Không tìm thấy dữ liệu hoặc đã có lỗi xảy ra.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
            <Button onClick={() => refetch()}>Tải lại</Button>
          </div>
        </div>
      </div>
    );
  }

  const helperText = DELIVERY_STATUS_HELPER[order.status];

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <PageHeader
        title={`Đơn hàng ${getOrderCode(order)}`}
        subtitle="Theo dõi trạng thái và thông tin chi tiết đơn đặt hàng"
        action={{
          label: "Quay lại",
          icon: ArrowLeft,
          onClick: () => navigate(`/stores/${resolvedStoreId}/orders`),
        }}
      />

      <StoreOrderProgress status={order.status} />

      {/* 🔒 Committed / Locked banner */}
      {isCommitted && order.status !== "RECEIVED_BY_STORE" && order.status !== "CANCELLED" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-3">
            <PackageCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 leading-none">Đơn hàng đã được xác nhận cung ứng</h3>
              <p className="text-sm text-blue-800/80 mt-1.5 leading-relaxed">
                Kho đã bắt đầu chuẩn bị hoặc đang giao hàng. Hiện tại bạn <strong>không thể hủy</strong> đơn hàng này.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <OrderDetailStats
        order={order}
        helperText={helperText}
        hasDroppedOrPartial={hasDroppedOrPartial}
        totalForwarded={totalForwarded}
        totalRequested={totalRequested}
        totalDropped={totalDropped}
        formatDate={formatDate}
      />

      {/* Order Info Section */}
      <OrderDetailInfo
        order={order}
        orderCode={getOrderCode(order)}
        formatDateTime={formatDateTime}
      />

      {/* Product Items Table */}
      <OrderDetailProductTable
        items={order.items}
        isItemDropped={isItemDropped}
        isItemPartial={isItemPartial}
      />

      {/* Ingredient Items Table */}
      <OrderDetailIngredientTable
        ingredientItems={order.ingredientItems ?? []}
        isItemDropped={isItemDropped}
        isItemPartial={isItemPartial}
      />

      {/* Actions Toolbar */}
      {(canSubmit || canCancel) && (
        <div className="sticky bottom-6 flex gap-3 justify-end bg-background/80 backdrop-blur-md p-4 rounded-2xl border shadow-xl animate-in slide-in-from-bottom-4 duration-500">
          {canSubmit && (
            <Button
              onClick={handleSubmitOrder}
              disabled={submitOrder.isPending}
              className="px-8 font-bold"
            >
              <PackageCheck size={18} className="mr-2" />
              {submitOrder.isPending ? "Đang gửi..." : "Gửi đơn hàng"}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => {
                setCancelOpen(true);
                setCancelReason("");
              }}
              className="px-8 font-bold"
            >
              <XCircle size={18} className="mr-2" />
              Hủy đơn hàng
            </Button>
          )}
        </div>
      )}

      {/* Cancellation Dialog */}
      <OrderCancelDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        orderCode={getOrderCode(order)}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        onConfirm={handleConfirmCancel}
        isLoading={cancelOrder.isPending}
      />
    </div>
  );
};

export default StoreOrderDetail;
