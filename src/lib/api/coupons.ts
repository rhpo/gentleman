import { supabase } from '$lib/supabase';
import type { Database } from '$lib/types/database';

export type Coupon = Database['public']['Tables']['coupons']['Row'];

export interface ValidCouponResult {
	valid: true;
	discount: number;
	coupon: Coupon;
}

export async function findActiveCouponByCode(code: string): Promise<Coupon | null> {
	const normalized = code.toUpperCase();

	const { data, error } = await supabase
		.from('coupons')
		.select('*')
		.eq('code', normalized)
		.eq('active', true)
		.single();

	if (error) {
		if (error.code === 'PGRST116') return null;
		throw new Error(error.message);
	}

	return data || null;
}

export async function validateCoupon(code: string): Promise<ValidCouponResult> {
	const coupon = await findActiveCouponByCode(code);

	if (!coupon) {
		throw new Error('Coupon not found');
	}

	const now = new Date();
	const validFrom = new Date(coupon.valid_from);
	const validUntil = new Date(coupon.valid_until);

	if (now < validFrom || now > validUntil) {
		throw new Error('Coupon expired or not yet valid');
	}

	return {
		valid: true,
		discount: coupon.reduction_percent,
		coupon
	};
}

