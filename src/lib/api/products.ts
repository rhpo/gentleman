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

import { toCdnStorageUrl } from '$lib/utils/storage-url';
import { STORAGE_BUCKETS } from '$lib/constants/storage';

function transformProduct(p: any): ProductWithBrand {
	if (!p) return p;
	const brandName = p.brands?.name ? p.brands.name.trim() : undefined;
	return {
		...p,
		image: toCdnStorageUrl(p.image, STORAGE_BUCKETS.PRODUCT_IMAGES),
		brand: brandName,
		brands: p.brands
			? {
					...p.brands,
					name: brandName || p.brands.name,
					logo: toCdnStorageUrl(p.brands.logo, STORAGE_BUCKETS.BRAND_LOGOS)
				}
			: undefined,
		variants: (p.product_variants ?? []).sort((a: any, b: any) => a.size - b.size),
	} as ProductWithBrand;
}

import {
	tokenizeSearchQuery,
	sanitizeTokenForPostgrest,
	filterAndRankProducts,
	calculateRelevanceScore,
	normalizeBrandParam
} from '$lib/utils/search';

/**
 * Get all products matching filters
 */
export async function getProducts(
    supabase: SupabaseClient<Database>,
    filters: ProductFilters = {}
): Promise<ProductWithBrand[]> {
	const rawQuery = filters.query ? filters.query.trim() : '';
	const tokens = tokenizeSearchQuery(rawQuery);

	let query = supabase
		.from('products')
		.select('*, brands!inner(name, logo), product_variants(id, size, price)');

	// Apply database level text search filters if tokens exist
	if (tokens.length > 0) {
		for (const rawToken of tokens) {
			const safeToken = sanitizeTokenForPostgrest(rawToken);
			if (!safeToken) continue;
			const q = `%${safeToken}%`;
			query = query.or(
				`name.ilike.${q},brands.name.ilike.${q},description.ilike.${q},type.ilike.${q},category.ilike.${q},gender.ilike.${q},scent_family.ilike.${q},occasion.ilike.${q}`
			);
		}
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
		const cleanBrand = normalizeBrandParam(filters.brand);
		if (cleanBrand) {
			query = query.ilike('brands.name', `%${cleanBrand}%`);
		}
	}

	let data: any[] | null = null;
	let error: any = null;

	try {
		const result = await query.order('id', { ascending: false });
		data = result.data;
		error = result.error;
	} catch (e) {
		error = e;
	}

	// Fallback to fetching products without text query filter if PostgREST query failed
	if (error && tokens.length > 0) {
		console.warn('PostgREST search query failed, falling back to in-memory search ranking:', error);
		let fallbackQuery = supabase
			.from('products')
			.select('*, brands!inner(name, logo), product_variants(id, size, price)');

		if (filters.type) fallbackQuery = fallbackQuery.eq('type', filters.type);
		if (filters.gender) {
			if (filters.gender === 'Men' || filters.gender === 'Women') {
				fallbackQuery = fallbackQuery.in('gender', [filters.gender, 'Unisex']);
			} else {
				fallbackQuery = fallbackQuery.eq('gender', filters.gender);
			}
		}
		if (filters.scentFamily) fallbackQuery = fallbackQuery.eq('scent_family', filters.scentFamily);
		if (filters.occasion) fallbackQuery = fallbackQuery.eq('occasion', filters.occasion);
		if (filters.brand) {
			const cleanBrand = normalizeBrandParam(filters.brand);
			if (cleanBrand) {
				fallbackQuery = fallbackQuery.ilike('brands.name', `%${cleanBrand}%`);
			}
		}

		const fallbackResult = await fallbackQuery.order('id', { ascending: false });
		if (!fallbackResult.error && fallbackResult.data) {
			const transformed = fallbackResult.data.map(transformProduct);
			return filterAndRankProducts(transformed, rawQuery);
		}
		throw new Error(error.message || 'Failed to fetch products');
	}

	if (error) {
		throw new Error(error.message || 'Failed to fetch products');
	}

	const transformedProducts = (data || []).map(transformProduct);

	// Rank results by relevance if a query was provided
	if (rawQuery && tokens.length > 0) {
		return transformedProducts
			.map((p) => ({ product: p, score: calculateRelevanceScore(p, rawQuery, tokens) }))
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score || b.product.id - a.product.id)
			.map((item) => item.product);
	}

	return transformedProducts;
}

/**
 * Get a single product by ID (includes variants)
 */
export async function getProductById(
    supabase: SupabaseClient<Database>,
    id: number
): Promise<ProductWithBrand | null> {
	const { data, error } = await supabase
		.from('products')
		.select('*, brands(name, logo), product_variants(id, size, price)')
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
		.select('*, brands(name, logo), product_variants(id, size, price)')
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
