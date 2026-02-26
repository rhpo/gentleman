import type { Order, OrderInput } from '$lib/types/entities';

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
 * Fetches a list of orders.
 */
export async function listOrders(): Promise<Order[]> {
    return apiCall('/api/admin/orders');
}

/**
 * Creates a new order by sending a POST request to the API.
 */
export async function createNewOrder(order: OrderInput): Promise<Order> {
    return apiCall('/api/admin/orders', { method: 'POST', body: JSON.stringify(order) });
}

/**
 * Updates an existing order with the given ID and order data.
 */
export async function updateExistingOrder(id: number, order: Partial<OrderInput>): Promise<Order> {
    return apiCall(`/api/admin/orders?id=${id}`, { method: 'PUT', body: JSON.stringify(order) });
}

/**
 * Deletes an existing order by its ID.
 */
export async function deleteExistingOrder(id: number): Promise<void> {
    return apiCall(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
}
