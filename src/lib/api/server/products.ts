import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Product, ProductWithBrand, ProductInput } from '$lib/types/entities';
import {
    uploadFile,
    deleteFile,
    generateProductImagePath,
    dataUriToUint8Array,
    getMimeType,
    extractPathFromUrl
} from '../storage';
import { STORAGE_BUCKETS } from '$lib/constants/storage';
/**
 * Get all products with their brand information and image URLs
 */
export async function getProducts(
    supabase: SupabaseClient<Database>
): Promise<ProductWithBrand[]> {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      brands!products_brand_id_fkey (*)
    `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Images are already URLs from the database
    return (data || []) as ProductWithBrand[];
}

/**
 * Get a single product by ID
 */
export async function getProductById(
    supabase: SupabaseClient<Database>,
    id: number
): Promise<ProductWithBrand | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*, brands!products_brand_id_fkey (*)')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }

    return data as unknown as ProductWithBrand;
}

/**
 * Create a new product with image upload to Supabase Storage
 */
export async function createProduct(
    supabase: SupabaseClient<Database>,
    product: ProductInput
): Promise<Product> {
    let imageUrl = '';

    // Image should already be a URL from /api/upload endpoint
    if (!product.image) {
        throw new Error('Image URL is required');
    }

    // Check if image is already a URL (starts with http) or base64
    if (product.image.startsWith('http')) {
        // Already uploaded, use the URL directly
        imageUrl = product.image;
    } else if (product.image.startsWith('data:')) {
        // Legacy: base64 data URI - upload it
        try {
            const tempId = `temp-${Date.now()}`;
            const imagePath = generateProductImagePath(tempId, 'product.jpg');
            const imageBytes = dataUriToUint8Array(product.image);
            const mimeType = getMimeType('product.jpg');

            imageUrl = await uploadFile(STORAGE_BUCKETS.PRODUCT_IMAGES, imagePath, imageBytes, mimeType);

            if (!imageUrl) {
                throw new Error('No URL returned from image upload');
            }
        } catch (err) {
            throw new Error(`Failed to upload image: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    } else {
        throw new Error('Image must be a valid URL or base64 data URI');
    }

    // Create product with image URL from storage
    // Never send base64 to database - only the S3 URL
    const { data, error } = await (supabase.from('products') as any)
        .insert([{
            name: product.name,
            type: product.type,
            category: product.category,
            gender: product.gender,
            scent_family: product.scent_family,
            occasion: product.occasion,
            size: product.size,
            brand_id: product.brand_id,
            image: imageUrl,           // S3 URL (required, not null)
            price: product.price,
            description: product.description
        }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as unknown as Product;
}

/**
 * Update an existing product (with optional image replacement)
 */
export async function updateProduct(
    supabase: SupabaseClient<Database>,
    id: number,
    product: Partial<ProductInput>
): Promise<Product> {
    let imageUrl = '';

    const processedProduct: any = { ...product };

    // If image is being updated, handle it
    if (product.image) {
        // Check if image is already a URL (from /api/upload) or base64
        if (product.image.startsWith('http')) {
            // Already uploaded, use the URL directly
            imageUrl = product.image;
        } else if (product.image.startsWith('data:')) {
            // Legacy: base64 data URI - upload it
            try {
                const imagePath = generateProductImagePath(id, 'product.jpg');
                const imageBytes = dataUriToUint8Array(product.image);
                const mimeType = getMimeType('product.jpg');

                imageUrl = await uploadFile(STORAGE_BUCKETS.PRODUCT_IMAGES, imagePath, imageBytes, mimeType);
            } catch (err) {
                throw new Error(`Failed to upload image: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        } else {
            throw new Error('Image must be a valid URL or base64 data URI');
        }
    }

    if (imageUrl) {
        processedProduct.image = imageUrl;  // Set URL instead
    } else {
        delete processedProduct.image;      // Keep existing image if not updating
    }

    const { data, error } = await (supabase.from('products') as any)
        .update(processedProduct)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as unknown as Product;
}

/**
 * Delete a product (and its image)
 */
export async function deleteProduct(supabase: SupabaseClient<Database>, id: number): Promise<void> {
    // Get the product to find image path
    const { data: productData } = await supabase.from('products').select('image_path').eq('id', id).single();

    // Delete from database
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    // Delete image from storage
    if ((productData as any)?.image_path) {
        await deleteFile(STORAGE_BUCKETS.PRODUCT_IMAGES, (productData as any).image_path).catch((err: unknown) => {
            console.error('Failed to delete product image:', err);
        });
    }
}
