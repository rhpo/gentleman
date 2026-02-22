import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Brand } from '$lib/types/entities';

export type BrandWithCount = Brand & { products_count: number };

/**
 * Get all brands
 */
export async function getBrands(supabase: SupabaseClient<Database>): Promise<Brand[]> {
  const { data, error } = await supabase.from("brands").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data || []) as unknown as Brand[];
}

/**
 * Get all brands with product counts
 */
export async function getBrandsWithCount(supabase: SupabaseClient<Database>): Promise<BrandWithCount[]> {
	const { data, error } = await supabase
		.from('brands')
		.select('*, products(count)')
		.order('name', { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return (data as any[] || []).map(brand => ({
		...brand,
		products_count: brand.products?.[0]?.count || 0
	}));
}

/**
 * Get brand by ID
 */
export async function getBrandById(
  supabase: SupabaseClient<Database>,
  id: number
): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return (data || null) as unknown as Brand | null;
}

/**
 * Client-side wrappers using the default supabase client
 */
import { supabase as defaultSupabase } from '$lib/supabase';

export async function listBrands(): Promise<BrandWithCount[]> {
	return getBrandsWithCount(defaultSupabase);
}

