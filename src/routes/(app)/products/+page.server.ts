// Products page server load
import type { PageServerLoad } from './$types';
import { getProducts } from '$lib/api/server/products';
import { getBrands } from '$lib/api/server/brands';

export const load: PageServerLoad = async ({ url, locals }) => {
    const filters = {
        query: url.searchParams.get('query') || '',
        type: url.searchParams.get('type') || '',
        gender: url.searchParams.get('gender') || '',
        scentFamily: url.searchParams.get('scent_family') || '',
        occasion: url.searchParams.get('occasion') || '',
        size: url.searchParams.get('size') || '',
        brand: url.searchParams.get('brand') || ''
    };

    try {
        const [products, brands] = await Promise.all([
            getProducts(locals.supabase, filters),
            getBrands(locals.supabase)
        ]);

        return {
            products,
            brands,
            filters
        };
    } catch (err) {
        console.error('Unexpected error loading products:', err);
        return {
            products: [],
            brands: [],
            error: 'An unexpected error occurred'
        };
    }
};
