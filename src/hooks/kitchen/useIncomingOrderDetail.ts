import { useQuery } from "@tanstack/react-query";
import { incomingOrdersApi } from "@/api/kitchen/incomingOrdersApi";

export const useIncomingOrderDetail = (
  centralKitchenId: number,
  orderId: number
) => {
  return useQuery({
    queryKey: ["incomingOrderDetail", centralKitchenId, orderId],
    queryFn: () => incomingOrdersApi.detail(centralKitchenId, orderId),
    enabled: !!centralKitchenId && !!orderId,
  });
};