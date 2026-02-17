import type { Cookies } from '@sveltejs/kit';
import type { Brand, BrandInput } from '$lib/types/entities';
import { getBrandsServer, createBrandServer, updateBrandServer, deleteBrandServer } from '$lib/api/services/brandsService';

export type { Brand, BrandInput };

// Server-side functions (for +page.server.ts and +server.ts)
/**
 * Retrieves a list of brands from the server.
 */
export async function getBrands(cookies: Cookies): Promise<Brand[]> {
	return getBrandsServer(cookies);
}

export async function deleteBrand(cookies: Cookies, id: number): Promise<void> {
	return deleteBrandServer(cookies, id);
}

/**
 * Creates a brand by calling the server function.
 */
export async function createBrand(cookies: Cookies, brand: BrandInput): Promise<Brand> {
	return createBrandServer(cookies, brand);
}

/**
 * Updates a brand by calling the server function.
 */
export async function updateBrand(cookies: Cookies, id: number, brand: Partial<BrandInput>): Promise<Brand> {
	return updateBrandServer(cookies, id, brand);
}

// Client-side API layer (for +page.svelte)
/**
 * Makes an asynchronous API call to the specified endpoint.
 *
 * This function uses the Fetch API to send a request to the given endpoint with optional request options.
 * It checks the response status and throws an error if the response is not OK, providing a fallback error message.
 * If the response is successful, it returns the parsed JSON data.
 *
 * @param {string} endpoint - The URL of the API endpoint to call.
 * @param {RequestInit} [options] - Optional configuration for the request, such as headers and method.
 */
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

/**
 * Creates a new brand by making an API call.
 */
export async function createNewBrand(brand: BrandInput): Promise<Brand> {
	return apiCall('/api/admin/brands', { method: 'POST', body: JSON.stringify(brand) });
}

/**
 * Updates an existing brand with the given ID and data.
 */
export async function updateExistingBrand(id: number, brand: Partial<BrandInput>): Promise<Brand> {
	return apiCall(`/api/admin/brands?id=${id}`, { method: 'PUT', body: JSON.stringify(brand) });
}

/**
 * Deletes an existing brand by its ID.
 */
export async function deleteExistingBrand(id: number): Promise<void> {
	return apiCall(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
}

