import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';
import { getOrders, getOrderById } from '../orders';

export { getOrders, getOrderById };

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
