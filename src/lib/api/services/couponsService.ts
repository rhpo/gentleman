import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';
import type { Coupon, CouponInput } from '$lib/types/entities';

function createSupabaseClient(cookies: Cookies) {
    return createServerClient<Database>(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => cookies.getAll(),
                setAll: (cookiesToSet: any) => {
                    cookiesToSet.forEach(({ name, value, options }: any) => {
                        cookies.set(name, value, { ...options, path: '/' });
                    });
                }
            }
        }
    );
}

export async function getCouponsServer(cookies: Cookies): Promise<Coupon[]> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Coupon[];
}

export async function getCouponByIdServer(cookies: Cookies, id: number): Promise<Coupon | null> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('coupons').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Coupon | null;
}

export async function createCouponServer(cookies: Cookies, coupon: CouponInput): Promise<Coupon> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('coupons') as any).insert([coupon]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Coupon;
}

export async function updateCouponServer(
    cookies: Cookies,
    id: number,
    coupon: Partial<CouponInput>
): Promise<Coupon> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('coupons') as any)
        .update(coupon)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Coupon;
}

export async function deleteCouponServer(cookies: Cookies, id: number): Promise<void> {
    const supabase = createSupabaseClient(cookies);
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
