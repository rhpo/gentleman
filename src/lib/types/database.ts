// Database type definitions for Supabase
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number;
                    name: string;
                    type: 'parfum' | 'montre' | 'lunettes';
                    category: 'Eau de Parfum' | 'Eau de Toilette' | 'Cologne' | 'Body Mist' | null;
                    gender: 'Men' | 'Women' | 'Unisex';
                    scent_family: 'Floral' | 'Fruity' | 'Woody' | 'Oriental' | 'Fresh' | 'Gourmand' | null;
                    occasion: 'Everyday' | 'Evening' | 'Romantic' | 'Sport' | 'Luxury' | null;
                    size: 'Sample' | 'Standard' | 'Large';
                    brand_id: number | null;
                    image: string; // bytea stored as base64
                    price: number;
                    description: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    name: string;
                    type: 'parfum' | 'montre' | 'lunettes';
                    category?: 'Eau de Parfum' | 'Eau de Toilette' | 'Cologne' | 'Body Mist' | null;
                    gender: 'Men' | 'Women' | 'Unisex';
                    scent_family?: 'Floral' | 'Fruity' | 'Woody' | 'Oriental' | 'Fresh' | 'Gourmand' | null;
                    occasion?: 'Everyday' | 'Evening' | 'Romantic' | 'Sport' | 'Luxury' | null;
                    size: 'Sample' | 'Standard' | 'Large';
                    brand_id?: number | null;
                    image: string;
                    price: number;
                    description: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    name?: string;
                    type?: 'parfum' | 'montre' | 'lunettes';
                    category?: 'Eau de Parfum' | 'Eau de Toilette' | 'Cologne' | 'Body Mist' | null;
                    gender?: 'Men' | 'Women' | 'Unisex';
                    scent_family?: 'Floral' | 'Fruity' | 'Woody' | 'Oriental' | 'Fresh' | 'Gourmand' | null;
                    occasion?: 'Everyday' | 'Evening' | 'Romantic' | 'Sport' | 'Luxury' | null;
                    size?: 'Sample' | 'Standard' | 'Large';
                    brand_id?: number | null;
                    image?: string;
                    price?: number;
                    description?: string;
                    created_at?: string;
                };
            };
            brands: {
                Row: {
                    id: number;
                    name: string;
                    logo: string; // bytea stored as base64
                    short_description: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    name: string;
                    logo: string;
                    short_description: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    name?: string;
                    logo?: string;
                    short_description?: string;
                    created_at?: string;
                };
            };
            orders: {
                Row: {
                    id: number;
                    customer_name: string;
                    phone_number: string;
                    address: string;
                    wilaya: number; // 1-69
                    products: Json; // array of {product_id: number, quantity: number}
                    status: 'pending' | 'shipped' | 'completed' | 'canceled';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    customer_name: string;
                    phone_number: string;
                    address: string;
                    wilaya: number;
                    products: Json;
                    status?: 'pending' | 'shipped' | 'completed' | 'canceled';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    customer_name?: string;
                    phone_number?: string;
                    address?: string;
                    wilaya?: number;
                    products?: Json;
                    status?: 'pending' | 'shipped' | 'completed' | 'canceled';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            coupons: {
                Row: {
                    id: number;
                    code: string;
                    reduction_percent: number;
                    valid_from: string;
                    valid_until: string;
                    active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    code: string;
                    reduction_percent: number;
                    valid_from: string;
                    valid_until: string;
                    active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    code?: string;
                    reduction_percent?: number;
                    valid_from?: string;
                    valid_until?: string;
                    active?: boolean;
                    created_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
