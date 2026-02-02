import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

export interface AdminLoginInput {
	email: string;
	password: string;
}

export interface AdminLoginResult {
	success: boolean;
	message?: string;
}

export async function serverLogin(cookies: any, input: AdminLoginInput): Promise<AdminLoginResult> {
	const supabaseServer = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => cookies.getAll(),
				setAll: (cookiesToSet: any) => {
					cookiesToSet.forEach(({ name, value, options }: any) => {
						cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	const { data, error } = await supabaseServer.auth.signInWithPassword({
		email: input.email,
		password: input.password
	});

	if (error) {
		throw new Error(error.message);
	}

	return {
		success: true,
		message: 'Login successful'
	};
}

export async function serverCheckAuth(cookies: any): Promise<boolean> {
	const supabaseServer = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => cookies.getAll(),
				setAll: (cookiesToSet: any) => {
					cookiesToSet.forEach(({ name, value, options }: any) => {
						cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	const { data: { session } } = await supabaseServer.auth.getSession();
	return !!session;
}

