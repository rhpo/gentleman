import type { Cookies } from '@sveltejs/kit';
import type { Brand, BrandInput } from '$lib/types/entities';
import { getBrandsServer, createBrandServer, updateBrandServer, deleteBrandServer } from '$lib/api/services/brandsService';

export type { Brand, BrandInput };

// Server-side functions (for +page.server.ts and +server.ts)
export async function getBrands(cookies: Cookies): Promise<Brand[]> {
	return getBrandsServer(cookies);
}

export async function deleteBrand(cookies: Cookies, id: number): Promise<void> {
	return deleteBrandServer(cookies, id);
}

export async function createBrand(cookies: Cookies, brand: BrandInput): Promise<Brand> {
	return createBrandServer(cookies, brand);
}

export async function updateBrand(cookies: Cookies, id: number, brand: Partial<BrandInput>): Promise<Brand> {
	return updateBrandServer(cookies, id, brand);
}

// Client-side API layer (for +page.svelte)
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const response = await fetch(endpoint, {
		headers: { 'Content-Type': 'application/json', ...options?.headers },
		...options
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(error.error || `Request failed: ${response.status}`);
	}
	return response.json();
}

export async function listBrands(): Promise<Brand[]> {
	return apiCall('/api/admin/brands');
}

export async function createNewBrand(brand: BrandInput): Promise<Brand> {
	return apiCall('/api/admin/brands', { method: 'POST', body: JSON.stringify(brand) });
}

export async function updateExistingBrand(id: number, brand: Partial<BrandInput>): Promise<Brand> {
	return apiCall(`/api/admin/brands?id=${id}`, { method: 'PUT', body: JSON.stringify(brand) });
}

export async function deleteExistingBrand(id: number): Promise<void> {
	return apiCall(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
}

