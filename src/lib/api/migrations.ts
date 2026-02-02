import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin, STORAGE_BUCKETS, deleteFile } from './storage';

/**
 * Migration helper to move existing base64 images from database to Supabase Storage
 * This handles products and brands with existing BYTEA image data
 */

export async function migrateProductImagesToStorage(
    supabase: SupabaseClient<any>
): Promise<{ products: number; brands: number; errors: string[] }> {
    const errors: string[] = [];
    let productCount = 0;
    let brandCount = 0;

    try {
        // Migrate product images
        const { data: products, error: productsError } = await (supabase as any)
            .from('products')
            .select('id, image, image_path')
            .filter('image_path', 'is', null);

        if (productsError) {
            errors.push(`Failed to fetch products: ${productsError.message}`);
            return { products: productCount, brands: brandCount, errors };
        }

        for (const product of products || []) {
            try {
                const p = product as any;
                if (!p.image || p.image_path) continue;

                let imageBytes: Uint8Array;
                if (p.image instanceof Uint8Array) {
                    imageBytes = p.image;
                } else if (Array.isArray(p.image)) {
                    imageBytes = new Uint8Array(p.image);
                } else if (typeof p.image === 'string') {
                    const binaryString = atob(p.image);
                    imageBytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        imageBytes[i] = binaryString.charCodeAt(i);
                    }
                } else {
                    continue;
                }

                const path = `products/${p.id}-migrated-${Date.now()}.jpg`;
                const admin = getSupabaseAdmin();
                const { data, error } = await admin.storage
                    .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
                    .upload(path, imageBytes, { contentType: 'image/jpeg', upsert: false });

                if (error) throw error;

                const { data: publicData } = admin.storage
                    .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
                    .getPublicUrl(data.path);

                await (supabase as any).from('products').update({ image: publicData.publicUrl, image_path: path }).eq('id', p.id);

                productCount++;
                console.log(`✓ Migrated product ${p.id}`);
            } catch (err) {
                const p = product as any;
                const msg = `Failed to migrate product ${p.id}: ${err instanceof Error ? err.message : String(err)}`;
                errors.push(msg);
                console.error(msg);
            }
        }

        // Migrate brand logos
        const { data: brands, error: brandsError } = await (supabase as any)
            .from('brands')
            .select('id, logo, logo_path')
            .filter('logo_path', 'is', null);

        if (brandsError) {
            errors.push(`Failed to fetch brands: ${brandsError.message}`);
            return { products: productCount, brands: brandCount, errors };
        }

        for (const brand of brands || []) {
            try {
                const b = brand as any;
                if (!b.logo || b.logo_path) continue;

                let logoBytes: Uint8Array;
                if (b.logo instanceof Uint8Array) {
                    logoBytes = b.logo;
                } else if (Array.isArray(b.logo)) {
                    logoBytes = new Uint8Array(b.logo);
                } else if (typeof b.logo === 'string') {
                    const binaryString = atob(b.logo);
                    logoBytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        logoBytes[i] = binaryString.charCodeAt(i);
                    }
                } else {
                    continue;
                }

                const path = `brands/${b.id}-migrated-${Date.now()}.jpg`;
                const admin = getSupabaseAdmin();
                const { data, error } = await admin.storage
                    .from(STORAGE_BUCKETS.BRAND_LOGOS)
                    .upload(path, logoBytes, { contentType: 'image/jpeg', upsert: false });

                if (error) throw error;

                const { data: publicData } = admin.storage
                    .from(STORAGE_BUCKETS.BRAND_LOGOS)
                    .getPublicUrl(data.path);

                await (supabase as any).from('brands').update({ logo: publicData.publicUrl, logo_path: path }).eq('id', b.id);

                brandCount++;
                console.log(`✓ Migrated brand ${b.id}`);
            } catch (err) {
                const b = brand as any;
                const msg = `Failed to migrate brand ${b.id}: ${err instanceof Error ? err.message : String(err)}`;
                errors.push(msg);
                console.error(msg);
            }
        }
    } catch (err) {
        const msg = `Migration failed: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        console.error(msg);
    }

    return { products: productCount, brands: brandCount, errors };
}
