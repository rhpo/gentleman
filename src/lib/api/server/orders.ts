import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';

export async function getOrders(supabase: SupabaseClient<Database>): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Order[];
}

export async function getOrderById(supabase: SupabaseClient<Database>, id: number): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Order | null;
}

export async function createOrder(supabase: SupabaseClient<Database>, order: OrderInput): Promise<Order> {
    const { data, error } = await (supabase.from('orders') as any).insert([order]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Order;
}

export async function updateOrder(
    supabase: SupabaseClient<Database>,
    id: number,
    order: Partial<OrderInput>
): Promise<Order> {
    const { data, error } = await (supabase.from('orders') as any)
        .update(order)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Order;
}

export async function deleteOrder(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
