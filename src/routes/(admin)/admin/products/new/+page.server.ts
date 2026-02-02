import type { PageServerLoad } from './$types';
import * as brandService from '$lib/api/server/brands';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const brands = await brandService.getBrands(locals.supabase);
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
