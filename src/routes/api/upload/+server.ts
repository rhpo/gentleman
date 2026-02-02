import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { STORAGE_BUCKETS } from '$lib/constants/storage';

import {
    uploadFile,
    deleteFile,
    generateProductImagePath,
    getMimeType,
    dataUriToUint8Array
} from '$lib/api/storage';

/**
 * POST /api/upload
 * Uploads an image file to Supabase Storage
 * Body: { image: base64DataUri, fileName: string, bucket: 'product-images' | 'brand-logos' }
 * Returns: { url: string, path: string }
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { image, fileName, bucket, entityId } = await request.json();

        if (!image || !fileName || !bucket) {
            return json(
                { error: 'Missing required fields: image, fileName, bucket' },
                { status: 400 }
            );
        }

        // Validate bucket
        if (bucket !== STORAGE_BUCKETS.PRODUCT_IMAGES && bucket !== STORAGE_BUCKETS.BRAND_LOGOS) {
            return json(
                { error: `Invalid bucket. Must be one of: ${STORAGE_BUCKETS.PRODUCT_IMAGES}, ${STORAGE_BUCKETS.BRAND_LOGOS}` },
                { status: 400 }
            );
        }

        // Generate file path
        let path: string;
        if (bucket === STORAGE_BUCKETS.PRODUCT_IMAGES) {
            path = generateProductImagePath(entityId || 'temp', fileName);
        } else {
            path = generateProductImagePath(entityId || 'temp', fileName); // brands use same function for now
        }

        console.log('Upload request:', { fileName, bucket, path, imageLength: image.length });

        // Convert base64 to Uint8Array
        const imageBytes = dataUriToUint8Array(image);
        console.log('Converted to bytes:', { bytesLength: imageBytes.length });

        // Get MIME type from filename
        const mimeType = getMimeType(fileName);
        console.log('MIME type:', mimeType);

        // Upload to Supabase Storage
        console.log('Uploading to path:', path);
        const url = await uploadFile(bucket, path, imageBytes, mimeType);
        console.log('Upload success:', url);

        return json({ url, path }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
        console.error('Error details:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : 'No stack'
        });
        return json(
            { error: errorMessage },
            { status: 500 }
        );
    }
};

/**
 * DELETE /api/upload
 * Deletes a file from Supabase Storage
 * Body: { bucket: 'product-images' | 'brand-logos', path: string }
 * Returns: { success: boolean }
 */
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { bucket, path } = await request.json();

        if (!bucket || !path) {
            return json(
                { error: 'Missing required fields: bucket, path' },
                { status: 400 }
            );
        }

        // Validate bucket
        if (bucket !== STORAGE_BUCKETS.PRODUCT_IMAGES && bucket !== STORAGE_BUCKETS.BRAND_LOGOS) {
            return json(
                { error: `Invalid bucket. Must be one of: ${STORAGE_BUCKETS.PRODUCT_IMAGES}, ${STORAGE_BUCKETS.BRAND_LOGOS}` },
                { status: 400 }
            );
        }

        // Delete from Supabase Storage
        await deleteFile(bucket, path);

        return json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Delete error:', error);
        return json(
            { error: error instanceof Error ? error.message : 'Failed to delete file' },
            { status: 500 }
        );
    }
};
