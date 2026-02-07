import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import type { ProductWithBrand } from '$lib/types/entities';
import { Buffer } from 'buffer';
import { listBrands, type Brand } from '$lib/api/brands';

function hexToBase64(hex: string): string {
    if (!hex) return '';
    // Handle Postgres hex format \x...
    const cleanHex = hex.startsWith('\\x') ? hex.slice(2) : hex;
    try {
        return Buffer.from(cleanHex, 'hex').toString('base64');
    } catch (e) {
        console.error('Error converting hex to base64:', e);
        return hex;
    }
}

export const load: PageServerLoad = async () => {
    const { data: products, error } = await supabase
        .from('products')
        .select('*, brands(name)')
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error('Error fetching featured products:', error);
        return {
            featuredProducts: [],
            brands: []
        };
    }

    // Transform data for the frontend
    const featuredProducts = (products as ProductWithBrand[]).map(product => {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image ? product.image : '',
            type: product.type,
            brand: (product as any).brands?.name
        };
    });

    // Fetch all brands
    let brands: Brand[] = [];

    try {
        brands = await listBrands();
    } catch (err) {
        console.error('Error fetching brands:', err);
    }

    return {
        featuredProducts,
        brands
    };
};
