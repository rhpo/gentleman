import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';

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

export async function getOrdersServer(cookies: Cookies): Promise<Order[]> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Order[];
}

export async function getOrderByIdServer(cookies: Cookies, id: number): Promise<Order | null> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Order | null;
}

export async function createOrderServer(cookies: Cookies, order: OrderInput): Promise<Order> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('orders') as any).insert([order]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Order;
}

export async function updateOrderServer(
    cookies: Cookies,
    id: number,
    order: Partial<OrderInput>
): Promise<Order> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('orders') as any)
        .update(order)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Order;
}

export async function deleteOrderServer(cookies: Cookies, id: number): Promise<void> {
    const supabase = createSupabaseClient(cookies);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
