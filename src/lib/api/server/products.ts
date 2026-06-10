import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Product, ProductInput, ProductVariantInput } from '$lib/types/entities';
import { getProducts, getProductById } from '../products';
import { uploadFile, deleteFile } from '../storage.server';
import {
    generateProductImagePath,
    dataUriToUint8Array,
    getMimeType,
    extractPathFromUrl
} from '../storage';
import { STORAGE_BUCKETS } from '$lib/constants/storage';

export { getProducts, getProductById };

async function resolveImageUrl(
    supabaseAdmin: SupabaseClient<Database>,
    image: string,
    pathId: string
): Promise<string> {
    if (image.startsWith('http')) return image;
    if (image.startsWith('data:')) {
        const imagePath = generateProductImagePath(pathId, 'product.jpg');
        const imageBytes = dataUriToUint8Array(image);
        const mimeType = getMimeType('product.jpg');
        const url = await uploadFile(supabaseAdmin, STORAGE_BUCKETS.PRODUCT_IMAGES, imagePath, imageBytes, mimeType);
        if (!url) throw new Error('No URL returned from image upload');
        return url;
    }
    throw new Error('Image must be a valid URL or base64 data URI');
}

async function saveVariants(
    supabase: SupabaseClient<Database>,
    productId: number,
    variants: ProductVariantInput[]
): Promise<void> {
    // Replace all variants for this product
    await (supabase.from('product_variants') as any).delete().eq('product_id', productId);
    if (variants.length === 0) return;
    const rows = variants.map(v => ({ product_id: productId, size: v.size, price: v.price }));
    const { error } = await (supabase.from('product_variants') as any).insert(rows);
    if (error) throw new Error(`Failed to save variants: ${error.message}`);
}

/**
 * Create a new product (with optional size variants)
 */
export async function createProduct(
    supabase: SupabaseClient<Database>,
    supabaseAdmin: SupabaseClient<Database>,
    product: ProductInput
): Promise<Product> {
    if (!product.image) throw new Error('Image URL is required');

    const imageUrl = await resolveImageUrl(supabaseAdmin, product.image, `temp-${Date.now()}`);

    const hasVariants = product.variants && product.variants.length > 0;
    const size  = hasVariants ? product.variants![0].size  : product.size;
    const price = hasVariants ? Math.min(...product.variants!.map(v => v.price)) : product.price;

    const { data, error } = await (supabase.from('products') as any)
        .insert([{
            name:         product.name,
            type:         product.type,
            category:     product.category,
            gender:       product.gender,
            scent_family: product.scent_family,
            occasion:     product.occasion,
            size,
            brand_id:     product.brand_id,
            image:        imageUrl,
            price,
            description:  product.description,
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (hasVariants) {
        await saveVariants(supabase, data.id, product.variants!);
    }

    return data as unknown as Product;
}

/**
 * Update an existing product (with optional variant replacement)
 */
export async function updateProduct(
    supabase: SupabaseClient<Database>,
    supabaseAdmin: SupabaseClient<Database>,
    id: number,
    product: Partial<ProductInput>
): Promise<Product> {
    const processedProduct: any = { ...product };
    delete processedProduct.variants; // handled separately

    // Handle image update
    if (product.image) {
        processedProduct.image = await resolveImageUrl(supabaseAdmin, product.image, String(id));
    } else {
        delete processedProduct.image;
    }

    // If variants provided, derive authoritative size/price from them
    if (product.variants !== undefined) {
        if (product.variants.length > 0) {
            processedProduct.size  = product.variants[0].size;
            processedProduct.price = Math.min(...product.variants.map(v => v.price));
        }
        // Save variants (even if empty array = clear variants)
        await saveVariants(supabase, id, product.variants);
    }

    const { data, error } = await (supabase.from('products') as any)
        .update(processedProduct)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data as unknown as Product;
}

/**
 * Delete a product (and its image; variants cascade automatically)
 */
export async function deleteProduct(
    supabase: SupabaseClient<Database>,
    supabaseAdmin: SupabaseClient<Database>,
    id: number
): Promise<void> {
    const { data: productData } = await supabase.from('products').select('image').eq('id', id).single();

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    if ((productData as any)?.image) {
        const imagePath = extractPathFromUrl((productData as any).image);
        if (imagePath) {
            await deleteFile(supabaseAdmin, STORAGE_BUCKETS.PRODUCT_IMAGES, imagePath).catch((err: unknown) => {
                console.error('Failed to delete product image:', err);
            });
        }
    }
}
