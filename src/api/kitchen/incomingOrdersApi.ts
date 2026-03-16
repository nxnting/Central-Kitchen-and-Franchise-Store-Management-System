import adminApi from "../api";
import type { ApiResponse } from "@/types/common/apiResponse.types";
import type { StoreOrderQuery } from "@/types/store/storeOrder.types";
import type {
  IncomingOrder,
  IncomingOrderListData,
} from "@/types/kitchen/incomingOrder.types";

export const incomingOrdersApi = {
  list: async (centralKitchenId: number, params?: StoreOrderQuery) =>
    (
      await adminApi.get<ApiResponse<IncomingOrderListData>>(
        `/central-kitchens/${centralKitchenId}/incoming-orders`,
        { params }
      )
    ).data,

  detail: async (centralKitchenId: number, orderId: number) =>
    (
      await adminApi.get<ApiResponse<IncomingOrder>>(
        `/central-kitchens/${centralKitchenId}/incoming-orders/${orderId}`
      )
    ).data,
};