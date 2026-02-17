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
        // Fetch the order (for legacy products JSON)
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('products')
            .eq('id', orderId)
            .single() as any;

        // Fetch new order items
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id')
            .eq('order_id', orderId);

        if (orderError && !itemsError) {
            // If order error but items ok, maybe order doesn't exist?
            // But items depend on order.
            // If order fetch fails, likely 404.
            return json({ error: 'Order not found' }, { status: 404 });
        }

        let productIds: number[] = [];

        // 1. Process new order items
        if (orderItems && orderItems.length > 0) {
            productIds = orderItems.map((item: any) => item.product_id);
        }

        // 2. Process legacy products JSON (only if we didn't find items, or maybe merge?)
        // Let's merge for safety, though usually it's one or the other.
        if (order?.products) {
            let legacyProducts = order.products;
            if (typeof legacyProducts === 'string') {
                try {
                    legacyProducts = JSON.parse(legacyProducts);
                } catch (e) {
                    console.error('Error parsing legacy products JSON:', e);
                    legacyProducts = [];
                }
            }
            if (Array.isArray(legacyProducts)) {
                const legacyIds = legacyProducts.map((item: any) => item.product_id || item.id);
                productIds = [...new Set([...productIds, ...legacyIds])];
            }
        }

        console.log('Combined Product IDs:', productIds);

        if (productIds.length === 0) {
            return json([]);
        }

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
