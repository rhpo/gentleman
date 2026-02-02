import { supabase } from '$lib/supabase';
import type { Database } from '$lib/types/database';

type ProductRow = Database['public']['Tables']['products']['Row'];

type BrandRow = Database['public']['Tables']['brands']['Row'];

export interface ProductWithBrand extends ProductRow {
	brands?: Pick<BrandRow, 'name' | 'logo'> | null;
}

export interface ProductFilters {
	query?: string;
	type?: ProductRow['type'] | '';
	gender?: ProductRow['gender'] | '';
	scentFamily?: ProductRow['scent_family'] | '';
	occasion?: ProductRow['occasion'] | '';
	size?: ProductRow['size'] | '';
}

/**
 * Get all products matching filters
 * Images are now stored as URLs in Supabase Storage
 */
export async function listProducts(filters: ProductFilters = {}): Promise<ProductWithBrand[]> {
	let query = supabase.from('products').select('*, brands(name, logo)');

	if (filters.query) {
		query = query.ilike('name', `%${filters.query}%`);
	}

	if (filters.type) {
		query = query.eq('type', filters.type);
	}

	if (filters.gender) {
		query = query.eq('gender', filters.gender);
	}

	if (filters.scentFamily) {
		query = query.eq('scent_family', filters.scentFamily);
	}

	if (filters.occasion) {
		query = query.eq('occasion', filters.occasion);
	}

	if (filters.size) {
		query = query.eq('size', filters.size);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	// Images are already URLs from the database
	return (data || []) as ProductWithBrand[];
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: number): Promise<ProductWithBrand | null> {
	const { data, error } = await supabase
		.from('products')
		.select('*, brands(name, logo)')
		.eq('id', id)
		.single();

	if (error) {
		if (error.code === 'PGRST116') return null; // not found
		throw new Error(error.message);
	}

	// Images are already URLs from the database
	return data as unknown as ProductWithBrand;
}

export async function deleteProduct(id: number): Promise<void> {
	const { error } = await supabase.from('products').delete().eq('id', id);

	if (error) {
		throw new Error(error.message);
	}
}

