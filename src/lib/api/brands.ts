import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Brand } from '$lib/types/entities';

export type BrandWithCount = Brand & { products_count: number };

/**
 * Get all brands along with their product counts.
 *
 * This function retrieves brand data from the 'brands' table in the Supabase database, including a count of associated products.
 * It orders the results by brand name in ascending order. If an error occurs during the data retrieval, it throws an error with the message from the Supabase response.
 *
 * @param supabase - An instance of SupabaseClient used to interact with the database.
 * @returns A promise that resolves to an array of Brand objects, each containing the brand data and the count of products.
 * @throws Error If there is an error during the data retrieval from Supabase.
 */
export async function getBrands(supabase: SupabaseClient<Database>): Promise<Brand[]> {
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
	})) as Brand[];
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

export async function listBrands(): Promise<Brand[]> {
	return getBrands(defaultSupabase);
}

