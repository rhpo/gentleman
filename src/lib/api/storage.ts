import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

/**
 * Lazy-load admin client (only on server-side)
 * This prevents SSR issues and invalid JWT errors
 */
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
    if (!supabaseAdminInstance) {
        if (!SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
        }
        supabaseAdminInstance = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    }
    return supabaseAdminInstance;
}

/**
 * Generate a unique filename for a product image
 * Format: products/{productId}_{timestamp}_{random}.jpg
 */
export function generateProductImagePath(productId: number | string, originalFileName: string): string {
    const extension = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `products/${productId}_${timestamp}_${random}.${extension}`;
}

/**
 * Generate a unique filename for a brand logo
 * Format: brands/{brandId}_{timestamp}_{random}.jpg
 */
export function generateBrandLogoPath(brandId: number | string, originalFileName: string): string {
    const extension = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `brands/${brandId}_${timestamp}_${random}.${extension}`;
}

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path in the bucket
 * @param file - The file data (Uint8Array or Buffer)
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: Uint8Array | Buffer,
    contentType: string = 'image/jpeg'
): Promise<string> {
    console.log('uploadFile called with:', { bucket, path, contentType, fileSize: file.length });

    const admin = getSupabaseAdmin();

    try {
        const { data, error } = await admin.storage
            .from(bucket)
            .upload(path, file, {
                contentType,
                upsert: false // Don't overwrite existing files
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Failed to upload file to ${bucket}/${path}: ${error.message}`);
        }

        console.log('Upload data:', data);

        // Return the public URL
        const {
            data: { publicUrl }
        } = admin.storage.from(bucket).getPublicUrl(data.path);

        console.log('Public URL generated:', publicUrl);
        return publicUrl;
    } catch (err) {
        console.error('uploadFile error:', err);
        throw err;
    }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path in the bucket
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
    // Handle null/empty paths
    if (!path) return;

    const admin = getSupabaseAdmin();
    const { error } = await admin.storage.from(bucket).remove([path]);

    if (error) {
        console.error(`Failed to delete file from ${bucket}/${path}: ${error.message}`);
        // Don't throw - file might already be deleted
    }
}

/**
 * Extract the file path from a public URL
 * Converts: https://bucket-url/storage/v1/object/public/bucket/path/to/file.jpg
 * To: path/to/file.jpg
 */
export function extractPathFromUrl(url: string): string {
    if (!url) return '';

    try {
        // Extract the path after '/object/public/{bucket}/'
        const match = url.match(/\/object\/public\/[^/]+\/(.+)/);
        return match ? match[1] : '';
    } catch {
        return '';
    }
}

/**
 * Convert a base64 data URI to a Uint8Array
 * @param dataUri - The data URI (e.g., "data:image/jpeg;base64,ABC123...")
 * @returns Uint8Array
 */
export function dataUriToUint8Array(dataUri: string): Uint8Array {
    console.log('dataUriToUint8Array input length:', dataUri.length);

    // Extract base64 part
    let base64 = dataUri.split(',')[1] || dataUri;
    console.log('Base64 extracted length:', base64.length);
    console.log('Base64 first 50 chars:', base64.substring(0, 50));

    // Pad base64 string if needed (should be multiple of 4)
    const originalLength = base64.length;
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    if (base64.length !== originalLength) {
        console.log('Padded base64 from', originalLength, 'to', base64.length);
    }

    // Convert base64 to binary string
    try {
        const binaryString = atob(base64);
        console.log('atob successful, binary length:', binaryString.length);

        // Convert binary string to Uint8Array
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        console.log('Uint8Array created, length:', bytes.length);
        return bytes;
    } catch (err) {
        console.error('atob failed:', err);
        console.error('Base64 that failed:', base64.substring(0, 100));
        throw new Error(`Invalid base64 encoding: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml'
    };
    return mimeTypes[ext || ''] || 'image/jpeg';
}
