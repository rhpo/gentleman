import type { Cookies } from '@sveltejs/kit';
import type { Database } from '$lib/types/database';
import type { Product, ProductWithBrand, ProductInput } from '$lib/types/entities';

import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

function createSupabaseClient(cookies: Cookies) {
    return createServerClient<Database>(
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
}

export async function getProductsServer(
    cookies: Cookies
): Promise<ProductWithBrand[]> {
    const supabase = createSupabaseClient(cookies);

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      brands!products_brand_id_fkey (*)
    `);

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function deleteProductServer(cookies: Cookies, id: number): Promise<void> {
    const supabase = createSupabaseClient(cookies);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

export async function createProductServer(cookies: Cookies, product: ProductInput): Promise<Product> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('products') as any).insert([product]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Product;
}

export async function updateProductServer(
    cookies: Cookies,
    id: number,
    product: Partial<ProductInput>
): Promise<Product> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('products') as any)
        .update(product)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Product;
}
