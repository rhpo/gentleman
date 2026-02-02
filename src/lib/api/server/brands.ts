import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Brand, BrandInput } from '$lib/types/entities';

export async function getBrands(supabase: SupabaseClient<Database>): Promise<Brand[]> {
    const { data, error } = await supabase.from('brands').select('*');
    if (error) throw new Error(error.message);
    return (data || []) as unknown as Brand[];
}

export async function getBrandById(supabase: SupabaseClient<Database>, id: number): Promise<Brand | null> {
    const { data, error } = await supabase.from('brands').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return (data || null) as unknown as Brand | null;
}

export async function createBrand(supabase: SupabaseClient<Database>, brand: BrandInput): Promise<Brand> {
    const { data, error } = await (supabase.from('brands') as any).insert([brand]).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as Brand;
}

export async function updateBrand(
    supabase: SupabaseClient<Database>,
    id: number,
    brand: Partial<BrandInput>
): Promise<Brand> {
    const { data, error } = await (supabase.from('brands') as any)
        .update(brand)
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as unknown as Brand;
}

export async function deleteBrand(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
