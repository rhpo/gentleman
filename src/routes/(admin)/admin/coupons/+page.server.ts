import type { PageServerLoad } from './$types';
import { getCoupons } from '$lib/api/server/coupons';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const coupons = await getCoupons(locals.supabase);
        return {
            coupons
        };
    } catch (err) {
        console.error('Error loading coupons:', err);
        return {
            coupons: [],
            error: err instanceof Error ? err.message : 'Failed to load coupons'
        };
    }
};
