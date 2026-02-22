import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Coupon, CouponInput } from '$lib/types/entities';
import {
    getCoupons,
    getCouponById,
    findActiveCouponByCode,
    validateCoupon,
    type ValidCouponResult
} from '../coupons';

export { getCoupons, getCouponById, findActiveCouponByCode, validateCoupon };
export type { ValidCouponResult };

export async function createCoupon(supabase: SupabaseClient<Database>, coupon: CouponInput): Promise<Coupon> {
    const { data, error } = await (supabase.from('coupons') as any).insert([coupon]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Coupon;
}

export async function updateCoupon(
    supabase: SupabaseClient<Database>,
    id: number,
    coupon: Partial<CouponInput>
): Promise<Coupon> {
    const { data, error } = await (supabase.from('coupons') as any)
        .update(coupon)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Coupon;
}

export async function deleteCoupon(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
