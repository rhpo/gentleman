import type { Coupon, CouponInput } from '$lib/types/entities';

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

export async function listCoupons(): Promise<Coupon[]> {
    return apiCall('/api/admin/coupons');
}

export async function createNewCoupon(coupon: CouponInput): Promise<Coupon> {
    return apiCall('/api/admin/coupons', { method: 'POST', body: JSON.stringify(coupon) });
}

export async function updateExistingCoupon(id: number, coupon: Partial<CouponInput>): Promise<Coupon> {
    return apiCall(`/api/admin/coupons?id=${id}`, { method: 'PUT', body: JSON.stringify(coupon) });
}

export async function deleteExistingCoupon(id: number): Promise<void> {
    return apiCall(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
}
