import type { Product, ProductWithBrand, ProductInput } from '$lib/types/entities';

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
