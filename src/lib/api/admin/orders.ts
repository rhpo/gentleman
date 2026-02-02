import type { Cookies } from '@sveltejs/kit';
import type { Order, OrderInput } from '$lib/types/entities';
import { getOrdersServer, createOrderServer, updateOrderServer, deleteOrderServer } from '$lib/api/services/ordersService';

export type { Order, OrderInput };

// Server-side functions (for +page.server.ts and +server.ts)
export async function getOrders(cookies: Cookies): Promise<Order[]> {
	return getOrdersServer(cookies);
}

export async function deleteOrder(cookies: Cookies, id: number): Promise<void> {
	return deleteOrderServer(cookies, id);
}

export async function createOrder(cookies: Cookies, order: OrderInput): Promise<Order> {
	return createOrderServer(cookies, order);
}

export async function updateOrder(cookies: Cookies, id: number, order: Partial<OrderInput>): Promise<Order> {
	return updateOrderServer(cookies, id, order);
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

export async function listOrders(): Promise<Order[]> {
	return apiCall('/api/admin/orders');
}

export async function createNewOrder(order: OrderInput): Promise<Order> {
	return apiCall('/api/admin/orders', { method: 'POST', body: JSON.stringify(order) });
}

export async function updateExistingOrder(id: number, order: Partial<OrderInput>): Promise<Order> {
	return apiCall(`/api/admin/orders?id=${id}`, { method: 'PUT', body: JSON.stringify(order) });
}

export async function deleteExistingOrder(id: number): Promise<void> {
	return apiCall(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
}
