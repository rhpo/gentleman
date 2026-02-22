import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface OrderProduct {
    product_id: number;
    quantity: number;
}

export const GET: RequestHandler = async ({ params, locals }) => {
    try {
        const orderId = Number(params.id);
        if (isNaN(orderId)) {
            return json({ error: 'Invalid order ID' }, { status: 400 });
        }

        // Fetch the order first to get product IDs
        const { data: order, error: orderError } = await locals.supabase
            .from('orders')
            .select('products')
            .eq('id', orderId)
            .single() as any;

        if (orderError || !order) {
            return json({ error: 'Order not found' }, { status: 404 });
        }

        const orderProducts = order.products as OrderProduct[];
        if (!orderProducts || orderProducts.length === 0) {
            return json([]);
        }

        // Extract product IDs from the order
        const productIds = orderProducts.map((item: OrderProduct) => item.product_id);

        // Fetch all product details with brands
        const { data: productDetails, error: productsError } = await locals.supabase
            .from('products')
            .select('*, brands(id, name, logo)')
            .in('id', productIds);

        if (productsError) {
            return json({ error: 'Failed to fetch products' }, { status: 500 });
        }

        return json(productDetails || []);
    } catch (err) {
        console.error('Error fetching order products:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
