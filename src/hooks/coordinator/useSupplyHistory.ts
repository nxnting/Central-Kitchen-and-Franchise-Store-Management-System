import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    getSupplyHistory,
    getIncomingOrderDetail
} from '@/api/coordinator/supplyApi';
import type { SupplyOrderListQuery } from '@/types/supply';

export const SUPPLY_HISTORY_KEY = 'supply-history';
export const INCOMING_ORDER_DETAIL_KEY = 'incoming-order-detail';

export function useSupplyHistory(params?: SupplyOrderListQuery) {
    return useQuery({
        queryKey: [SUPPLY_HISTORY_KEY, params],
        queryFn: () => getSupplyHistory(params),
        placeholderData: keepPreviousData,
    });
}

export function useIncomingOrderDetail(centralKitchenId?: number, orderId?: number) {
    return useQuery({
        queryKey: [INCOMING_ORDER_DETAIL_KEY, centralKitchenId, orderId],
        queryFn: () => getIncomingOrderDetail(centralKitchenId!, orderId!),
        enabled: !!centralKitchenId && !!orderId,
    });
}
