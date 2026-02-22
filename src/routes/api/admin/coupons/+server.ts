import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as couponService from '$lib/api/server/coupons';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const coupons = await couponService.getCoupons(locals.supabase);
        return json(coupons);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch coupons' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const coupon = await request.json();
        const created = await couponService.createCoupon(locals.supabase, coupon);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create coupon' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await couponService.deleteCoupon(locals.supabase, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete coupon' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const coupon = await request.json();
        const updated = await couponService.updateCoupon(locals.supabase, id, coupon);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update coupon' }, { status: 500 });
    }
};
