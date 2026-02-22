import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Coupon } from '$lib/types/entities';

export interface ValidCouponResult {
	valid: true;
	discount: number;
	coupon: Coupon;
}

/**
 * Get all coupons
 */
export async function getCoupons(supabase: SupabaseClient<Database>): Promise<Coupon[]> {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Coupon[];
}

/**
 * Get coupon by ID
 */
export async function getCouponById(supabase: SupabaseClient<Database>, id: number): Promise<Coupon | null> {
    const { data, error } = await supabase.from('coupons').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Coupon | null;
}

/**
 * Find active coupon by code
 */
export async function findActiveCouponByCode(
    supabase: SupabaseClient<Database>,
    code: string
): Promise<Coupon | null> {
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

/**
 * Validate a coupon
 */
export async function validateCoupon(
    supabase: SupabaseClient<Database>,
    code: string
): Promise<ValidCouponResult> {
	const coupon = await findActiveCouponByCode(supabase, code);

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

/**
 * Client-side wrappers using default supabase client
 */
import { supabase as defaultSupabase } from '$lib/supabase';

export async function findActiveCouponByCodeClient(code: string) {
    return findActiveCouponByCode(defaultSupabase, code);
}

export async function validateCouponClient(code: string) {
    return validateCoupon(defaultSupabase, code);
}

