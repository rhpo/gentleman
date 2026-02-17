import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';

/**
 * Retrieves a list of orders from the Supabase database.
 *
 * This function queries the 'orders' table and includes related 'order_items' and 'products' data.
 * It orders the results by the 'created_at' timestamp in descending order.
 * If an error occurs during the query, it throws an error with the message from the Supabase response.
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
    return (data || []) as unknown as Order[];
}

/**
 * Retrieves an order by its ID from the Supabase database.
 *
 * This function queries the 'orders' table for a specific order identified by the provided ID.
 * It also fetches related order items and product details. If an error occurs during the query,
 * it checks for a specific error code and returns null if found; otherwise, it throws an error.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance used to interact with the database.
 * @param {number} id - The unique identifier of the order to retrieve.
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
    return (data || null) as unknown as Order | null;
}

/**
 * Create a new order in the database along with its associated items.
 *
 * This function first fetches the product prices to ensure consistency, then inserts the order into the 'orders' table.
 * It subsequently inserts the order items into the 'order_items' table. If any step fails, it handles errors appropriately,
 * including a potential rollback of the order creation. Finally, it retrieves and returns the full order details.
 *
 * @param supabase - The Supabase client instance used for database operations.
 * @param order - The order input data containing items and other order details.
 * @returns The created order with all its details.
 * @throws Error If fetching product prices, inserting the order, or inserting order items fails, or if the created order cannot be retrieved.
 */
export async function createOrder(supabase: SupabaseClient<Database>, order: OrderInput): Promise<Order> {
    const { items, ...orderData } = order;

    // 1. Fetch product prices for consistency
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', items.map(i => i.product_id));

    if (productsError) throw new Error(`Failed to fetch product prices: ${productsError.message}`);

    const priceMap = new Map((products as any)?.map((p: any) => [p.id, p.price]));

    // 2. Insert Order
    // Note: 'products' column is legacy but required by DB constraint if not nullable.
    // We pass [] to satisfy it if needed, or let DB handle defaults.
    const { data: newOrder, error: orderError } = await (supabase.from('orders') as any) // Cast to any to bypass strict type checking on 'products' if outdated
        .insert([{
            ...orderData,
            products: [] // Legacy field
        }])
        .select()
        .single();

    if (orderError) throw new Error(orderError.message);

    // 3. Insert Order Items
    const orderItemsData = items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: priceMap.get(item.product_id) ?? 0
    }));

    const { error: itemsError } = await (supabase.from('order_items') as any)
        .insert(orderItemsData);

    if (itemsError) {
        // Rollback? Supabase doesn't support easy rollback here without RPC.
        // For now, allow failure but log it. Ideally we delete the order.
        await supabase.from('orders').delete().eq('id', newOrder.id);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // 4. Return full order
    const createdOrder = await getOrderById(supabase, newOrder.id);
    if (!createdOrder) throw new Error('Order created but failed to retrieve');
    return createdOrder;
}

/**
 * Updates an existing order in the database.
 *
 * This function separates the items from the order data and updates the order details such as status and other information in the 'orders' table.
 * If an error occurs during the update, it throws an error with the message. After updating, it retrieves the updated order using the getOrderById function.
 * If the updated order cannot be retrieved, it throws an error indicating the failure.
 *
 * @param supabase - The Supabase client instance used to interact with the database.
 * @param id - The unique identifier of the order to be updated.
 * @param order - The partial order data containing the fields to be updated.
 */
export async function updateOrder(
    supabase: SupabaseClient<Database>,
    id: number,
    order: Partial<OrderInput>
): Promise<Order> {
    // Separate items from order data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...orderData } = order;

    // Update order details (status, etc)
    const { error } = await (supabase.from('orders') as any)
        .update(orderData)
        .eq('id', id);

    if (error) throw new Error(error.message);

    // If items need updating, that's complex (delete all and recreate? or diff?).
    // For this query, we implement basic order update (status, info).
    // If items logic is needed, it should be added here.

    const updated = await getOrderById(supabase, id);
    if (!updated) throw new Error('Failed to retrieve updated order');
    return updated;
}

export async function deleteOrder(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
