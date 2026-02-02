import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBrandByIdServer } from '$lib/api/services/brandsService';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const brandId = Number(params.id);

    try {
        const brand = await getBrandByIdServer(cookies, brandId);

        if (!brand) {
            throw error(404, 'Brand not found');
        }

        return {
            brand,
        };
    } catch (err) {
        console.error('Error loading brand:', err);
        throw error(500, 'Failed to load brand');
    }
};
