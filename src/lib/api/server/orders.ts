import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Order, OrderInput } from '$lib/types/entities';
import { getOrders, getOrderById } from '../orders';

export { getOrders, getOrderById };

export async function createOrder(supabase: SupabaseClient<Database>, order: OrderInput): Promise<Order> {
    const { items, total_price, ...orderData } = order;

    if (!items || !Array.isArray(items)) {
        throw new Error('Order items are required');
    }

    // Fetch product base prices
    const productIds = [...new Set(items.map(i => i.product_id))];
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

    if (productsError) throw new Error(`Failed to fetch product prices: ${productsError.message}`);
    const productPriceMap = new Map((products as any[]).map((p: any) => [p.id, Number(p.price)]));

    // Fetch variant prices for items that specify a variant
    const variantIds = items.filter(i => i.variant_id).map(i => i.variant_id!);
    let variantPriceMap = new Map<number, number>();
    if (variantIds.length > 0) {
        const { data: variants } = await (supabase.from('product_variants') as any)
            .select('id, price')
            .in('id', variantIds);
        variantPriceMap = new Map((variants as any[] ?? []).map((v: any) => [v.id, Number(v.price)]));
    }

    // Insert order
    const { data: newOrder, error: orderError } = await (supabase.from('orders') as any)
        .insert([{ ...orderData, products: [] }])
        .select()
        .single();

    if (orderError) throw new Error(orderError.message);

    // Insert order items with correct prices
    const orderItemsData = items.map(item => ({
        order_id:   newOrder.id,
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        quantity:   item.quantity,
        unit_price: item.variant_id
            ? (variantPriceMap.get(item.variant_id) ?? productPriceMap.get(item.product_id) ?? 0)
            : (productPriceMap.get(item.product_id) ?? 0),
    }));

    const { error: itemsError } = await (supabase.from('order_items') as any).insert(orderItemsData);

    if (itemsError) {
        await supabase.from('orders').delete().eq('id', newOrder.id);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    const createdOrder = await getOrderById(supabase, newOrder.id);
    if (!createdOrder) throw new Error('Order created but failed to retrieve');
    return createdOrder;
}

export async function updateOrder(
    supabase: SupabaseClient<Database>,
    id: number,
    order: Partial<OrderInput>
): Promise<Order> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, total_price, ...orderData } = order;

    const { error } = await (supabase.from('orders') as any)
        .update(orderData)
        .eq('id', id);

    if (error) throw new Error(error.message);

    const updated = await getOrderById(supabase, id);
    if (!updated) throw new Error('Failed to retrieve updated order');
    return updated;
}

export async function deleteOrder(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
