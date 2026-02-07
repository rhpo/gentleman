import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

export const GET: RequestHandler = async ({ params, cookies }) => {
    try {
        const orderId = Number(params.id);
        if (isNaN(orderId)) {
            return json({ error: 'Invalid order ID' }, { status: 400 });
        }

        const supabase = createServerClient<Database>(
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

        // Fetch the order first to get product IDs
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('products')
            .eq('id', orderId)
            .single() as any;

        if (orderError || !order) {
            return json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('Order Products Raw:', order.products);
        let orderProducts = order.products as any[];

        // Handle case where products might be a string (JSON column)
        if (typeof order.products === 'string') {
            try {
                orderProducts = JSON.parse(order.products);
            } catch (e) {
                console.error('Error parsing order products JSON:', e);
                orderProducts = [];
            }
        }

        if (!orderProducts || !Array.isArray(orderProducts) || orderProducts.length === 0) {
            console.log('No order products found for orderId:', orderId);
            return json([]);
        }

        // Extract product IDs from the order
        const productIds = orderProducts.map((item: any) => item.product_id || item.id);
        console.log('Mapped Product IDs:', productIds);

        // Fetch all product details with brands
        const { data: productDetails, error: productsError } = await supabase
            .from('products')
            .select('*, brands(id, name, logo)')
            .in('id', productIds);

        if (productsError) {
            return json({ error: 'Failed to fetch products' }, { status: 500 });
        }

        const products = (productDetails as any[]) || [];
        const transformedProducts = products.map(p => ({
            ...p,
            brand: (p as any).brands,
            price: Number(p.price)
        }));

        return json(transformedProducts);
    } catch (err) {
        console.error('Error fetching order products:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
