import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as brandService from '$lib/api/server/brands';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const brands = await brandService.getBrands(locals.supabase);
        return json(brands);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch brands' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const brand = await request.json();
        const created = await brandService.createBrand(locals.supabase, brand);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create brand' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await brandService.deleteBrand(locals.supabase, locals.supabaseAdmin, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete brand' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const brand = await request.json();
        const updated = await brandService.updateBrand(locals.supabase, id, brand);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update brand' }, { status: 500 });
    }
};
