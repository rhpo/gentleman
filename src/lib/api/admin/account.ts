import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export interface AdminLoginInput {
	email: string;
	password: string;
}

export interface AdminLoginResult {
	success: boolean;
	message?: string;
}

/**
 * Perform login using the provided supabase client
 */
export async function serverLogin(
	supabase: SupabaseClient<Database>,
	input: AdminLoginInput
): Promise<AdminLoginResult> {
	const { error } = await supabase.auth.signInWithPassword({
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

/**
 * Check auth session using the provided supabase client
 */
export async function serverCheckAuth(supabase: SupabaseClient<Database>): Promise<boolean> {
	const { data: { session } } = await supabase.auth.getSession();
	return !!session;
}

