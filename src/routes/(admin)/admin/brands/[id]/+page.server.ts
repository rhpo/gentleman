import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBrandById } from '$lib/api/server/brands';

export const load: PageServerLoad = async ({ params, locals }) => {
    const brandId = Number(params.id);

    try {
        const brand = await getBrandById(locals.supabase, brandId);

        if (!brand) {
            throw error(404, 'Brand not found');
        }

        return {
            brand,
        };
    } catch (err) {
        if (err instanceof Error && 'status' in (err as any)) throw err;
        console.error('Error loading brand:', err);
        throw error(500, 'Failed to load brand');
    }
};
