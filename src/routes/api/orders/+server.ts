import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOrder } from '$lib/api/server/orders';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const orderInput = await request.json();
        const created = await createOrder(locals.supabase, orderInput);
        return json(created, { status: 201 });
    } catch (err) {
        console.error('Order creation error:', err);
        return json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
    }
};
