import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { ProductWithBrand } from '$lib/types/entities';

type ProductRow = Database['public']['Tables']['products']['Row'];

export interface ProductFilters {
	query?: string;
	type?: ProductRow['type'] | '';
	gender?: ProductRow['gender'] | '';
	scentFamily?: ProductRow['scent_family'] | '';
	occasion?: ProductRow['occasion'] | '';
	size?: ProductRow['size'] | '';
	brand?: string;
}

function transformProduct(p: any): ProductWithBrand {
	return {
		...p,
		brand: p.brands?.name
	} as ProductWithBrand;
}

/**
 * Get all products matching filters
 */
export async function getProducts(
    supabase: SupabaseClient<Database>,
    filters: ProductFilters = {}
): Promise<ProductWithBrand[]> {
	let query = supabase
		.from('products')
		.select('*, brands!inner(name, logo)');

	if (filters.query) {
		const q = `%${filters.query}%`;
		query = query.or(`name.ilike.${q},description.ilike.${q},type.ilike.${q},category.ilike.${q},gender.ilike.${q},scent_family.ilike.${q},occasion.ilike.${q}`);
	}

	if (filters.type) query = query.eq('type', filters.type);
	if (filters.gender) {
		if (filters.gender === 'Men' || filters.gender === 'Women') {
			query = query.in('gender', [filters.gender, 'Unisex']);
		} else {
			query = query.eq('gender', filters.gender);
		}
	}
	if (filters.scentFamily) query = query.eq('scent_family', filters.scentFamily);
	if (filters.occasion) query = query.eq('occasion', filters.occasion);

	if (filters.size) {
		const sizeVal = Number(filters.size);
		if (sizeVal === 50) {
			query = query.lte('size', 50);
		} else if (sizeVal === 100) {
			query = query.gt('size', 50).lte('size', 100);
		} else if (sizeVal === 200) {
			query = query.gt('size', 100);
		} else {
			query = query.eq('size', sizeVal);
		}
	}

	if (filters.brand) {
		query = query.eq('brands.name', filters.brand);
	}

	const { data, error } = await query.order('id', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return (data || []).map(transformProduct);
}

/**
 * Get a single product by ID
 */
export async function getProductById(
    supabase: SupabaseClient<Database>,
    id: number
): Promise<ProductWithBrand | null> {
	const { data, error } = await supabase
		.from('products')
		.select('*, brands(name, logo)')
		.eq('id', id)
		.single();

	if (error) {
		if (error.code === 'PGRST116') return null; // not found
		throw new Error(error.message);
	}

	return transformProduct(data);
}

/**
 * Get multiple products by IDs
 */
export async function getProductsByIds(
    supabase: SupabaseClient<Database>,
    ids: number[]
): Promise<ProductWithBrand[]> {
	if (!ids.length) return [];

	const { data, error } = await supabase
		.from('products')
		.select('*, brands(name, logo)')
		.in('id', ids);

	if (error) {
		throw new Error(error.message);
	}

	return (data || []).map(transformProduct);
}

/**
 * Client-side wrappers using the default supabase client
 */
import { supabase as defaultSupabase } from '$lib/supabase';

export async function listProducts(filters: ProductFilters = {}): Promise<ProductWithBrand[]> {
	return getProducts(defaultSupabase, filters);
}

export async function getProductByIdClient(id: number): Promise<ProductWithBrand | null> {
	return getProductById(defaultSupabase, id);
}

export async function getProductsByIdsClient(ids: number[]): Promise<ProductWithBrand[]> {
	return getProductsByIds(defaultSupabase, ids);
}

