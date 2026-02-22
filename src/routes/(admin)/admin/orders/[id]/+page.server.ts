import type { PageServerLoad } from './$types';
import { getOrderById } from '$lib/api/server/orders';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const orderId = Number(params.id);
        if (isNaN(orderId)) {
            throw error(400, 'Invalid order ID');
        }

        const order = await getOrderById(locals.supabase, orderId);
        if (!order) {
            throw error(404, 'Order not found');
        }

        return {
            order
        };
    } catch (err) {
        if (err instanceof Error && 'status' in (err as any)) {
            throw err;
        }
        console.error('Error loading order:', err);
        throw error(500, 'Failed to load order');
    }
};
