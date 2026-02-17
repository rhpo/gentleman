import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const orderInput = await request.json();
        const { supabase } = locals;

        const { items, ...orderData } = orderInput;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return json({ error: 'Order must contain items' }, { status: 400 });
        }

        // 1. Fetch product prices (SERVER SIDE VALIDATION)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price')
            .in('id', items.map((i: any) => i.product_id));

        if (productsError) {
            console.error('Error fetching prices:', productsError);
            return json({ error: 'Failed to validate products' }, { status: 500 });
        }

        const priceMap = new Map((products as any[])?.map((p: any) => [p.id, p.price]));

        // 2. Insert Order
        // Note: passing [] to products JSON column
        const { data: newOrder, error: orderError } = await (supabase.from('orders') as any)
            .insert([{
                ...orderData,
                products: []
            }])
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            return json({ error: orderError.message }, { status: 500 });
        }

        // 3. Insert Items
        const orderItemsData = items.map((item: any) => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: priceMap.get(item.product_id) ?? 0
        }));

        const { error: itemsError } = await (supabase.from('order_items') as any)
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Attempt rollback
            await supabase.from('orders').delete().eq('id', newOrder.id);
            return json({ error: 'Failed to create order items' }, { status: 500 });
        }

        return json(newOrder, { status: 201 });
    } catch (err) {
        console.error('Order creation error:', err);
        return json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
    }
};
