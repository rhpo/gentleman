import type { LayoutServerLoad } from './$types';
import { getCouponsServer } from '$lib/api/services/couponsService';

export const load: LayoutServerLoad = async ({ cookies }) => {
    try {
        const coupons = await getCouponsServer(cookies);
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
