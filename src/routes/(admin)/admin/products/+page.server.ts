import type { PageServerLoad } from './$types';
import * as productService from '$lib/api/server/products';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const products = await productService.getProducts(locals.supabase);
        return {
            products
        };
    } catch (err) {
        console.error('Error loading products:', err);
        return {
            products: [],
            error: err instanceof Error ? err.message : 'Failed to load products'
        };
    }
};
