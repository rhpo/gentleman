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

export async function getOrderByIdServer(cookies: Cookies, id: number): Promise<Order | null> {
    const supabase = createSupabaseClient(cookies);
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

export async function createOrderServer(cookies: Cookies, order: OrderInput): Promise<Order> {
    const supabase = createSupabaseClient(cookies);
    const { items, ...orderData } = order;

    // 1. Fetch product prices
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', items.map(i => i.product_id));

    if (productsError) throw new Error(`Failed to fetch product prices: ${productsError.message}`);

    const priceMap = new Map((products as any)?.map((p: any) => [p.id, p.price]));

    // 2. Insert Order
    const { data: newOrder, error: orderError } = await (supabase.from('orders') as any)
        .insert([{
            ...orderData,
            products: [] // Legacy field
        }])
        .select()
        .single();

    if (orderError) throw new Error(orderError.message);

    // 3. Insert Items
    const orderItemsData = items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: priceMap.get(item.product_id) ?? 0
    }));

    const { error: itemsError } = await (supabase.from('order_items') as any)
        .insert(orderItemsData);

    if (itemsError) {
        // Cleanup on failure
        await supabase.from('orders').delete().eq('id', newOrder.id);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    const created = await getOrderByIdServer(cookies, newOrder.id);
    if (!created) throw new Error('Order created but failed to retrieve');
    return created;
}

export async function updateOrderServer(
    cookies: Cookies,
    id: number,
    order: Partial<OrderInput>
): Promise<Order> {
    const supabase = createSupabaseClient(cookies);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...orderData } = order;

    const { error } = await (supabase.from('orders') as any)
        .update(orderData)
        .eq('id', id);

    if (error) throw new Error(error.message);

    const updated = await getOrderByIdServer(cookies, id);
    if (!updated) throw new Error('Failed to retrieve updated order');
    return updated;
}

export async function deleteOrderServer(cookies: Cookies, id: number): Promise<void> {
    const supabase = createSupabaseClient(cookies);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
