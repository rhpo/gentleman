// Products page server load
import type { PageServerLoad } from './$types';
import { listProducts, type ProductWithBrand } from '$lib/api/products';
import { listBrands } from '$lib/api/brands';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('query') || '';
    const type = (url.searchParams.get('type') || '') as any;
    const gender = (url.searchParams.get('gender') || '') as any;
    const scentFamily = (url.searchParams.get('scent_family') || '') as any;
    const occasion = (url.searchParams.get('occasion') || '') as any;
    const size = (url.searchParams.get('size') || '') as any;
    const brand = url.searchParams.get('brand') || '';

    try {
        const products = (await listProducts({
            query,
            type,
            gender,
            scentFamily,
            occasion,
            size,
            brand
        })) as ProductWithBrand[];

        // Convert bytea to base64 for images
        const productsWithImages = products?.map((product) => ({
            ...product,
            image: product.image
                ? product.image
                : '/api/placeholder/400/533',
            brand: product.brands?.name || undefined
        })) || [];

        const brandsList = await listBrands();

        return {
            products: productsWithImages,
            brands: brandsList,
            filters: { query, type, gender, scentFamily, occasion, size, brand }
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            products: [],
            error: 'An unexpected error occurred'
        };
    }
};
