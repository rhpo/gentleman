import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { serverLogin } from '$lib/api/admin/account';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const input = await request.json();
        await serverLogin(cookies, input);
        return json({ success: true });
    } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Login failed' }, { status: 401 });
    }
};
