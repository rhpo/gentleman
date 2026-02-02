import type { Brand, BrandInput } from '$lib/types/entities';

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
