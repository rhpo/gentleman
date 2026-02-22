import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { serverCheckAuth } from '$lib/api/admin/account';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (url.pathname.startsWith('/admin/login')) return {};

    const isAuthenticated = await serverCheckAuth(locals.supabase);
    if (!isAuthenticated) {
        throw redirect(303, '/admin/login');
    }

    return { authenticated: true };
};
