import type { PageServerLoad } from './$types';
import { getBrands } from '$lib/api/server/brands';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const brands = await getBrands(locals.supabase);
        return {
            brands
        };
    } catch (err) {
        console.error('Error loading brands:', err);
        return {
            brands: [],
            error: err instanceof Error ? err.message : 'Failed to load brands'
        };
    }
};
