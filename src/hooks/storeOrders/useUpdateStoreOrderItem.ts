import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeOrdersApi } from "@/api/store/storeOrdersApi";
import type { 
  UpdateStoreOrderProductItemPayload, 
  UpdateStoreOrderIngredientItemPayload 
} from "@/types/store/storeOrder.types";

export const useUpdateStoreOrderProductItem = (franchiseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      productId,
      payload,
    }: {
      orderId: number;
      productId: number;
      payload: UpdateStoreOrderProductItemPayload;
    }) => storeOrdersApi.updateProductItem(franchiseId, orderId, productId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["storeOrderDetail", franchiseId, variables.orderId],
      });
    },
  });
};

export const useUpdateStoreOrderIngredientItem = (franchiseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      ingredientId,
      payload,
    }: {
      orderId: number;
      ingredientId: number;
      payload: UpdateStoreOrderIngredientItemPayload;
    }) => storeOrdersApi.updateIngredientItem(franchiseId, orderId, ingredientId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["storeOrderDetail", franchiseId, variables.orderId],
      });
    },
  });
};
