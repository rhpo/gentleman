import type { LayoutServerLoad } from './$types';
import { getOrdersServer } from '$lib/api/services/ordersService';

export const load: LayoutServerLoad = async ({ cookies }) => {
    try {
        const orders = await getOrdersServer(cookies);
        return {
            orders
        };
    } catch (err) {
        console.error('Error loading orders:', err);
        return {
            orders: [],
            error: err instanceof Error ? err.message : 'Failed to load orders'
        };
    }
};
