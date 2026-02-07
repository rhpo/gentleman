import { supabase } from '$lib/supabase';
import type { Database } from '$lib/types/database';

export type Brand = Database['public']['Tables']['brands']['Row'];

export type BrandWithCount = Brand & { products_count: number };

export async function listBrands(): Promise<BrandWithCount[]> {
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

