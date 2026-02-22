import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as orderService from '$lib/api/server/orders';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const orders = await orderService.getOrders(locals.supabase);
        return json(orders);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch orders' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const order = await request.json();
        const created = await orderService.createOrder(locals.supabase, order);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create order' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await orderService.deleteOrder(locals.supabase, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete order' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const order = await request.json();
        const updated = await orderService.updateOrder(locals.supabase, id, order);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update order' }, { status: 500 });
    }
};
