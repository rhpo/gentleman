import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getOrders, deleteOrder, createOrder, updateOrder } from '$lib/api/admin/orders';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const orders = await getOrders(cookies);
        return json(orders);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch orders' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const order = await request.json();
        const created = await createOrder(cookies, order);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create order' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await deleteOrder(cookies, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete order' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ cookies, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const order = await request.json();
        const updated = await updateOrder(cookies, id, order);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update order' }, { status: 500 });
    }
};
