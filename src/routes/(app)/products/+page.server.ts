// Products page server load
import type { PageServerLoad } from './$types';
import { listProducts, type ProductWithBrand } from '$lib/api/products';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('query') || '';
    const type = url.searchParams.get('type') || '';
    const gender = url.searchParams.get('gender') || '';
    const scentFamily = url.searchParams.get('scent_family') || '';
    const occasion = url.searchParams.get('occasion') || '';
    const size = url.searchParams.get('size') || '';

    try {
        const products = (await listProducts({
            query,
            type,
            gender,
            scentFamily,
            occasion,
            size
        })) as ProductWithBrand[];

        // Convert bytea to base64 for images
        const productsWithImages = products?.map((product) => ({
            ...product,
            image: product.image
                ? product.image
                : '/api/placeholder/400/533',
            brand: product.brands?.name || undefined
        })) || [];

        return {
            products: productsWithImages,
            filters: { query, type, gender, scentFamily, occasion, size }
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            products: [],
            error: 'An unexpected error occurred'
        };
    }
};
