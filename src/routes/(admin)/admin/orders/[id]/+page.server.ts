import type { LayoutServerLoad } from './$types';
import { getOrderByIdServer } from '$lib/api/services/ordersService';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
    try {
        const orderId = Number(params.id);
        if (isNaN(orderId)) {
            throw error(400, 'Invalid order ID');
        }

        const order = await getOrderByIdServer(cookies, orderId);
        if (!order) {
            throw error(404, 'Order not found');
        }

        return {
            order
        };
    } catch (err) {
        if (err instanceof Error && 'status' in err) {
            throw err;
        }
        throw error(500, 'Failed to load order');
    }
};
