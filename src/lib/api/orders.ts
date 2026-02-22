import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';

function transformOrder(order: any): Order {
    return {
        ...order,
        total_price: (order.items || []).reduce(
            (sum: number, item: any) => sum + (item.unit_price * item.quantity),
            0
        )
    } as Order;
}

/**
 * Get all orders
 */
export async function getOrders(supabase: SupabaseClient<Database>): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items (
                order_item_id,
                product_id,
                quantity,
                unit_price,
                product:products (*)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(transformOrder);
}

/**
 * Get order by ID
 */
export async function getOrderById(supabase: SupabaseClient<Database>, id: number): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items (
                order_item_id,
                product_id,
                quantity,
                unit_price,
                product:products (*)
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }

    if (!data) return null;

    return transformOrder(data);
}

/**
 * Client-side wrappers
 */
import { supabase as defaultSupabase } from '$lib/supabase';

export async function createOrder(input: OrderInput): Promise<Order> {
	const response = await fetch('/api/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(input)
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(error.error || `Request failed: ${response.status}`);
	}

	return response.json();
}

export async function listOrders(): Promise<Order[]> {
    return getOrders(defaultSupabase);
}

