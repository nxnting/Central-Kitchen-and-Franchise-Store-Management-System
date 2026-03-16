import { useQuery } from "@tanstack/react-query";
import { incomingOrdersApi } from "@/api/kitchen/incomingOrdersApi";
import type { StoreOrderQuery } from "@/types/store/storeOrder.types";

export const useIncomingOrders = (
  centralKitchenId: number,
  params?: StoreOrderQuery
) => {
  return useQuery({
    queryKey: ["incomingOrders", centralKitchenId, params],
    queryFn: () => incomingOrdersApi.list(centralKitchenId, params),
    enabled: !!centralKitchenId,
  });
};