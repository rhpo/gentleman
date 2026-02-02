import type { LayoutServerLoad } from './$types';
import { getBrandsServer } from '$lib/api/services/brandsService';

export const load: LayoutServerLoad = async ({ cookies }) => {
    try {
        const brands = await getBrandsServer(cookies);
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
