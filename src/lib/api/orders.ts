import { supabase } from '$lib/supabase';
import type { Database, Json } from '$lib/types/database';

export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type NewOrder = Database['public']['Tables']['orders']['Insert'];

export interface CreateOrderInput {
	customer_name: string;
	phone_number: string;
	address: string;
	wilaya: number;
	items: {
		product_id: number;
		quantity: number;
	}[];
	status?: string;
	products?: any; // legacy compatibility if needed, but we prefer items
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
	// Map input to API expectation if needed
	// The API expects `items` array.
	// If input has `products` (JSON), we assume caller is outdated or passing legacy.
	// But we defined `items` in type now.

	// Check if input has items, if not use products as items (legacy conversion)
	let payload = { ...input };
	if (!payload.items && input.products && Array.isArray(input.products)) {
		payload.items = input.products.map((p: any) => ({
			product_id: p.product_id,
			quantity: p.quantity
		}));
	}

	const response = await fetch('/api/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(error.error || `Request failed: ${response.status}`);
	}

	return response.json();
}

export async function listOrders(): Promise<OrderRow[]> {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data || [];
}

