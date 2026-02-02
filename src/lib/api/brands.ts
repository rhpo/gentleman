import { supabase } from '$lib/supabase';
import type { Database } from '$lib/types/database';

export type Brand = Database['public']['Tables']['brands']['Row'];

export async function listBrands(): Promise<Brand[]> {
	const { data, error } = await supabase
		.from('brands')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data || [];
}

