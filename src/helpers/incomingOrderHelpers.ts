import { IncomingOrder, IncomingOrderItem } from "@/types/kitchen/incomingOrder.types";

export const getPartiallyForwardedItems = (
  order: IncomingOrder,
): IncomingOrderItem[] => {
  if (!order.items?.length) return [];
  return order.items.filter(
    (item) =>
      typeof item.forwardedQuantity === "number" &&
      item.forwardedQuantity > 0 &&
      item.forwardedQuantity < (item.quantity || 0),
  );
};

export const getDroppedItems = (order: IncomingOrder): IncomingOrderItem[] => {
  if (!order.items?.length) return [];
  return order.items.filter((item) => item.isDroppedFromForward === true || item.isDropped === true);
};

export const getFullyForwardedItems = (
  order: IncomingOrder,
): IncomingOrderItem[] => {
  if (!order.items?.length) return [];
  return order.items.filter(
    (item) =>
      (item.forwardedQuantity ?? 0) === (item.quantity || 0),
  );
};

export const hasPartialOrDroppedItems = (
  order: IncomingOrder,
): boolean => {
  if (!order.items?.length) return false;
  return order.items.some(
    (item) =>
      item.isDroppedFromForward === true ||
      item.isDropped === true ||
      (typeof item.forwardedQuantity === "number" &&
        item.forwardedQuantity > 0 &&
        item.forwardedQuantity < (item.quantity || 0)),
  );
};