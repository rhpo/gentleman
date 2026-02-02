import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBrands, deleteBrand, createBrand, updateBrand } from '$lib/api/admin/brands';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const brands = await getBrands(cookies);
        return json(brands);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch brands' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const brand = await request.json();
        const created = await createBrand(cookies, brand);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create brand' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await deleteBrand(cookies, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete brand' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ cookies, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const brand = await request.json();
        const updated = await updateBrand(cookies, id, brand);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update brand' }, { status: 500 });
    }
};
