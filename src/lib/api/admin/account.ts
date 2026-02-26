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
 * Logs in a user using the provided supabase client.
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
 * Checks if an auth session exists using the provided supabase client.
 */
export async function serverCheckAuth(supabase: SupabaseClient<Database>): Promise<boolean> {
	const { data: { session } } = await supabase.auth.getSession();
	return !!session;
}

