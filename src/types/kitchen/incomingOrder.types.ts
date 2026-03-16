export type IncomingOrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "LOCKED"
  | "CANCELLED";

export interface IncomingOrderItem {
  productId: number;
  productName: string;
  unit: string;
  quantity: number;
}

export interface IncomingOrder {
  storeOrderId: number;
  franchiseId: number;
  franchiseName: string;

  status: IncomingOrderStatus;

  orderDate: string;

  createdAt: string;
  updatedAt: string;

  submittedAt?: string | null;
  lockedAt?: string | null;
  cancelledAt?: string | null;

  cancelReason?: string | null;

  items: IncomingOrderItem[];
}

export interface IncomingOrderListData {
  items: IncomingOrder[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}