import { supabase } from '$lib/supabase';
import type { Database, Json } from '$lib/types/database';

export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type NewOrder = Database['public']['Tables']['orders']['Insert'];

export interface CreateOrderInput {
	customer_name: string;
	phone_number: string;
	address: string;
	wilaya: number;
	products: Json;
	status?: NewOrder['status'];
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
	const payload: NewOrder = {
		customer_name: input.customer_name,
		phone_number: input.phone_number,
		address: input.address,
		wilaya: input.wilaya,
		products: input.products,
		status: input.status ?? 'pending'
	};

	const { data, error } = await supabase.from('orders').insert(payload).select().single();

	if (error) {
		throw new Error(error.message);
	}

	return data as OrderRow;
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

