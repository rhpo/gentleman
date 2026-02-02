import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';
import type { Brand, BrandInput } from '$lib/types/entities';

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

export async function getBrandsServer(cookies: Cookies): Promise<Brand[]> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('brands').select('*');
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Brand[];
}

export async function getBrandByIdServer(cookies: Cookies, id: number): Promise<Brand | null> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await supabase.from('brands').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Brand | null;
}

export async function createBrandServer(cookies: Cookies, brand: BrandInput): Promise<Brand> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('brands') as any).insert([brand]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Brand;
}

export async function updateBrandServer(
    cookies: Cookies,
    id: number,
    brand: Partial<BrandInput>
): Promise<Brand> {
    const supabase = createSupabaseClient(cookies);
    const { data, error } = await (supabase.from('brands') as any)
        .update(brand)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Brand;
}

export async function deleteBrandServer(cookies: Cookies, id: number): Promise<void> {
    const supabase = createSupabaseClient(cookies);
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
