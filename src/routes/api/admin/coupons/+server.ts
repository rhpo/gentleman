import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCoupons, deleteCoupon, createCoupon, updateCoupon } from '$lib/api/admin/coupons';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const coupons = await getCoupons(cookies);
        return json(coupons);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch coupons' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const coupon = await request.json();
        const created = await createCoupon(cookies, coupon);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create coupon' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await deleteCoupon(cookies, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete coupon' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ cookies, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const coupon = await request.json();
        const updated = await updateCoupon(cookies, id, coupon);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update coupon' }, { status: 500 });
    }
};
