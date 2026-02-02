import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as productService from '$lib/api/server/products';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const products = await productService.getProducts(locals.supabase);
        return json(products);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to fetch products' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const product = await request.json();
        const created = await productService.createProduct(locals.supabase, product);
        return json(created, { status: 201 });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to create product' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        await productService.deleteProduct(locals.supabase, id);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to delete product' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
    try {
        const id = Number(url.searchParams.get('id'));
        if (!id) return json({ error: 'Missing id' }, { status: 400 });
        const product = await request.json();
        const updated = await productService.updateProduct(locals.supabase, id, product);
        return json(updated);
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Failed to update product' }, { status: 500 });
    }
};
