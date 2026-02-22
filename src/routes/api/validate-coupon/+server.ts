// Checkout API - Validate coupon
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateCoupon } from '$lib/api/server/coupons';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return json({ error: 'Invalid coupon code' }, { status: 400 });
        }

        const result = await validateCoupon(locals.supabase, code);

        return json({
            valid: result.valid,
            discount: result.discount
        });
    } catch (err) {
        console.error('Error validating coupon:', err);
        const message = err instanceof Error ? err.message : 'Failed to validate coupon';
        return json({ error: message }, { status: 400 });
    }
};
