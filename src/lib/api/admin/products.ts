import type { Cookies } from '@sveltejs/kit';
import type { Product, ProductWithBrand, ProductInput } from '$lib/types/entities';
import { getProductsServer, deleteProductServer, createProductServer, updateProductServer } from '$lib/api/services/productsService';

export type { Product, ProductWithBrand, ProductInput };

// Server-side functions (for +page.server.ts and +server.ts)
export async function getProducts(cookies: Cookies): Promise<ProductWithBrand[]> {
	return getProductsServer(cookies);
}

export async function deleteProduct(cookies: Cookies, id: number): Promise<void> {
	return deleteProductServer(cookies, id);
}

export async function createProduct(cookies: Cookies, product: ProductInput): Promise<Product> {
	return createProductServer(cookies, product);
}

export async function updateProduct(cookies: Cookies, id: number, product: Partial<ProductInput>): Promise<Product> {
	return updateProductServer(cookies, id, product);
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

export async function listProducts(): Promise<ProductWithBrand[]> {
	return apiCall('/api/admin/products');
}

export async function createNewProduct(product: ProductInput): Promise<Product> {
	return apiCall('/api/admin/products', { method: 'POST', body: JSON.stringify(product) });
}

export async function updateExistingProduct(id: number, product: Partial<ProductInput>): Promise<Product> {
	return apiCall(`/api/admin/products?id=${id}`, { method: 'PUT', body: JSON.stringify(product) });
}

export async function deleteExistingProduct(id: number): Promise<void> {
	return apiCall(`/api/admin/products?id=${id}`, { method: 'DELETE' });
}

