export interface SupplyOrderQueueItemLineResponse {
    productId: number;
    productName: string;
    sku?: string;
    unit: string;
    quantity: number;
    forwardedQuantity: number;
    droppedQuantity: number;
    isDroppedFromForward: boolean;
    dropReason: string | null;

    // Snapshot fields from BE
    hasForwardSnapshot?: boolean;
    isForwardSnapshotConsistent?: boolean;
    forwardSnapshotWarning?: string;
    rawForwardSnapshotRequestedQuantity?: number;
    rawForwardSnapshotForwardedQuantity?: number;
    rawForwardSnapshotDroppedQuantity?: number;
}

export interface SupplyOrderQueueIngredientLineResponse {
    ingredientId: number;
    ingredientName: string;
    unit: string;
    quantity: number;
    forwardedQuantity: number;
    droppedQuantity: number;
    isDroppedFromForward: boolean;
    dropReason: string | null;

    // Snapshot fields from BE
    hasForwardSnapshot?: boolean;
    isForwardSnapshotConsistent?: boolean;
    forwardSnapshotWarning?: string;
    rawForwardSnapshotRequestedQuantity?: number;
    rawForwardSnapshotForwardedQuantity?: number;
    rawForwardSnapshotDroppedQuantity?: number;
}

export interface SupplyOrderQueueItemResponse {
    storeOrderId: number;
    deliveryId?: number;
    orderCode: string;
    status: string;
    requestedDeliveryDate: string; // ISO Date String
    createdAt: string; // ISO Date String
    storeId: number;
    storeName: string;
    totalItems: number;
    totalQuantity: number;
    forwardedTotalItems: number;
    forwardedTotalQuantity: number;
    droppedTotalItems: number;
    droppedTotalQuantity: number;
    forwardedAt?: string;
    forwardedBy?: string;
    forwardNote?: string;
    processingNote?: string;
    items: SupplyOrderQueueItemLineResponse[];
    ingredientItems?: SupplyOrderQueueIngredientLineResponse[];
}

export interface SupplyProcessedOrderResponse {
    storeOrderId: number;
    orderCode: string;
    status: string;
    requestedDeliveryDate: string; // ISO Date String
    createdAt: string; // ISO Date String
    storeId: number;
    storeName: string;
    totalItems: number;
    totalQuantity: number;
    forwardedAt?: string;
    forwardedBy?: string;
    preparedAt?: string;
    preparedBy?: string;
    endedAt: string;
    endedBy?: string;
    endedNote?: string;
    forwardNote?: string;
    processingNote?: string;
    preparingNote?: string;
}

export interface PaginatedSupplyProcessedOrderResponse {
    items: SupplyProcessedOrderResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface SupplyOrderListQuery {
    status?: string;
    franchiseId?: number;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface PrepareDeliveryRequest {
    preparingNote?: string;
}

export interface UpdateSupplyDeliveryStatusRequest {
    status: string;
    statusNote?: string;
}

export interface PaginatedSupplyOrderQueueResponse {
    items: SupplyOrderQueueItemResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export interface UpdateDeliveryItemRequest {
    quantity: number;
}

export interface DeliveryBatchDetail {
    batchId: number;
    batchCode: string;
    quantity: number;
    createdAt: string;
    expiredAt?: string | null;
}

export interface DeliveryItemDetailResponse extends SupplyOrderQueueItemLineResponse {
    availableCentralKitchenBatches?: DeliveryBatchDetail[];
}

export interface DeliveryIngredientDetailResponse extends SupplyOrderQueueIngredientLineResponse {
    availableCentralKitchenBatches?: DeliveryBatchDetail[];
}

export interface DeliveryDetailResponse {
    deliveryId: number;
    deliveryPlanId: number;
    fromCentralKitchenId: number;
    fromCentralKitchenName: string;
    toFranchiseId: number;
    toFranchiseName: string;
    status: string;
    plannedDate: string;
    createdAt: string;
    confirmedAt?: string | null;
    productItems: DeliveryItemDetailResponse[];
    ingredientItems: DeliveryIngredientDetailResponse[];
}

export interface IncomingOrderDetailItemResponse {
    productId: number;
    productName: string;
    sku?: string;
    unit: string;
    quantity: number;
    productStatus?: string;
    forwardedQuantity: number;
    droppedQuantity: number;
    isDroppedFromForward: boolean;
    dropReason: string | null;
}

export interface IncomingOrderDetailIngredientItemResponse {
    ingredientId: number;
    ingredientName: string;
    unit: string;
    quantity: number;
    ingredientStatus?: string;
    forwardedQuantity: number;
    droppedQuantity: number;
    isDroppedFromForward: boolean;
    dropReason: string | null;
}

export interface IncomingOrderDetailResponse {
    storeOrderId: number;
    orderCode: string;
    status: string;
    requestedDeliveryDate: string;
    createdAt: string;
    storeNote?: string;
    storeId: number;
    storeName: string;
    storeAddress?: string;
    totalItems: number;
    totalQuantity: number;
    forwardedTotalItems: number;
    forwardedTotalQuantity: number;
    droppedTotalItems: number;
    droppedTotalQuantity: number;
    receivedAt?: string;
    receivedBy?: string;
    forwardedAt?: string;
    forwardedBy?: string;
    processingNote?: string;
    forwardNote?: string;
    items: IncomingOrderDetailItemResponse[];
    ingredientItems: IncomingOrderDetailIngredientItemResponse[];
}
