
// Product types
export type ProductType = 'parfum' | 'montre' | 'lunettes';
export type ProductCategory = 'Eau de Parfum' | 'Eau de Toilette' | 'Cologne' | 'Body Mist';
export type ProductGender = 'Men' | 'Women' | 'Unisex';
export type ScentFamily = 'Floral' | 'Fruity' | 'Woody' | 'Oriental' | 'Fresh' | 'Gourmand';
export type ProductOccasion = 'Everyday' | 'Evening' | 'Romantic' | 'Sport' | 'Luxury';
export type ProductSize = number;

export const PRODUCT_SIZE_OPTIONS = [
    { value: 50, label: 'Sample (50ml)' },
    { value: 100, label: 'Standard (100ml)' },
    { value: 200, label: 'Large (200ml)' },
] as const;

export interface Product {
    id: number;
    name: string;
    type: ProductType;
    category: ProductCategory | null;
    gender: ProductGender;
    scent_family: ScentFamily | null;
    occasion: ProductOccasion | null;
    size: ProductSize;
    brand_id: number | null;
    image: string;
    price: number;
    description: string;
    created_at: string;
}

export interface ProductInput {
    name: string;
    type: ProductType;
    category?: ProductCategory | null;
    gender: ProductGender;
    scent_family?: ScentFamily | null;
    occasion?: ProductOccasion | null;
    size: ProductSize;
    brand_id?: number | null;
    image: string;
    price: number;
    description: string;
}

export interface ProductWithBrand extends Product {
    brand?: Brand | string | null;
    brands?: any | null;
}

// Brand types
export interface Brand {
    id: number;
    name: string;
    logo: string;
    short_description: string;
    created_at: string;
    products_count?: number;
}

export interface BrandInput {
    name: string;
    logo: string;
    short_description: string;
}

// Order types
export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'canceled';

export interface OrderItem {
    order_item_id?: number; // Optional for input
    order_id?: number;      // Optional for input
    product_id: number;
    quantity: number;
    unit_price: number;     // captured at time of order
    product?: Product;      // joined product data
}

export interface Order {
    id: number;
    customer_name: string;
    phone_number: string;
    address: string;
    wilaya: number;
    items: OrderItem[];     // Normalized items
    status: OrderStatus;
    created_at: string;
    updated_at: string;
}

export interface OrderInput {
    customer_name: string;
    phone_number: string;
    address: string;
    wilaya: number;
    items: {
        product_id: number;
        quantity: number;
    }[];
    status?: OrderStatus;
}

// Coupon types
export interface Coupon {
    id: number;
    code: string;
    reduction_percent: number;
    valid_from: string;
    valid_until: string;
    active: boolean;
    created_at: string;
}

export interface CouponInput {
    code: string;
    reduction_percent: number;
    valid_from: string;
    valid_until: string;
    active?: boolean;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ApiError {
    error: string;
    status?: number;
}
