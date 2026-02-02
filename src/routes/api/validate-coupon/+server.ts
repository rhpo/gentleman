// Checkout API - Validate coupon
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateCoupon } from '$lib/api/coupons';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return json({ error: 'Invalid coupon code' }, { status: 400 });
        }

        const result = await validateCoupon(code);

        return json({
            valid: result.valid,
            discount: result.discount
        });
    } catch (err) {
        console.error('Error validating coupon:', err);
        return json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
};
