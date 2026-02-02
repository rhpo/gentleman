import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { serverCheckAuth } from '$lib/api/admin/account';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    if (url.pathname.startsWith('/admin/login')) return {};

    const isAuthenticated = await serverCheckAuth(cookies);
    if (!isAuthenticated) throw redirect(303, '/admin/login');

    return { authenticated: true };
};
