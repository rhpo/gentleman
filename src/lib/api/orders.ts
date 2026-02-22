import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';

/**
 * Transforms an order by calculating the total price from its items.
 */
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
 * Retrieve all orders from the Supabase database.
 *
 * This function queries the 'orders' table and selects all relevant fields, including associated order items and their product details.
 * It orders the results by the creation date in descending order. If an error occurs during the query, it throws an error with the message from the Supabase response.
 * Finally, it transforms the retrieved data using the transformOrder function before returning it.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance used to interact with the database.
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
 * Retrieve an order by its ID.
 *
 * This function queries the 'orders' table in the Supabase database using the provided ID.
 * It selects the order details along with associated items and their product information.
 * If an error occurs during the query, it checks for a specific error code to return null or throws an error with the message.
 * If no data is found, it also returns null. Finally, it transforms the retrieved order data before returning it.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance used for database operations.
 * @param {number} id - The ID of the order to retrieve.
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

