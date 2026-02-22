import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { serverLogin } from '$lib/api/admin/account';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const input = await request.json();
        await serverLogin(locals.supabase, input);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Login failed' }, { status: 401 });
    }
};
