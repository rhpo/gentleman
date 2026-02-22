import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database';

/**
 * Handles the event by creating standard and elevated Supabase clients.
 */
export const handle: Handle = async ({ event, resolve }) => {
    // Standard user client
    event.locals.supabase = createServerClient<Database>(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => event.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/' });
                    });
                }
            }
        }
    );

    // Elevated admin client
    event.locals.supabaseAdmin = createClient<Database>(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
    );

    return resolve(event);
};
