import type { Coupon, CouponInput } from '$lib/types/entities';

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

/**
 * Retrieves a list of coupons.
 */
export async function listCoupons(): Promise<Coupon[]> {
    return apiCall('/api/admin/coupons');
}

/**
 * Creates a new coupon by making an API call.
 */
export async function createNewCoupon(coupon: CouponInput): Promise<Coupon> {
    return apiCall('/api/admin/coupons', { method: 'POST', body: JSON.stringify(coupon) });
}

/**
 * Updates an existing coupon by its ID.
 */
export async function updateExistingCoupon(id: number, coupon: Partial<CouponInput>): Promise<Coupon> {
    return apiCall(`/api/admin/coupons?id=${id}`, { method: 'PUT', body: JSON.stringify(coupon) });
}

/**
 * Deletes an existing coupon by its ID.
 */
export async function deleteExistingCoupon(id: number): Promise<void> {
    return apiCall(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
}
