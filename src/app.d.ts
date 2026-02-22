// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient<import('$lib/types/database').Database>;
			supabaseAdmin: import('@supabase/supabase-js').SupabaseClient<import('$lib/types/database').Database>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

declare module '*.svg' {
	const content: string;
	export default content;
}
