import type { PageServerLoad } from './$types';
import { getOrders } from '$lib/api/server/orders';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const orders = await getOrders(locals.supabase);
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
