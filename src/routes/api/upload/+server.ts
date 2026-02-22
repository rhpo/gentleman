import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { STORAGE_BUCKETS } from "$lib/constants/storage";

import { uploadFile, deleteFile } from "$lib/api/storage.server";

import {
  generateProductImagePath,
  getMimeType,
  dataUriToUint8Array,
} from "$lib/api/storage";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { image, fileName, bucket, entityId } = await request.json();

    if (!image || !fileName || !bucket) {
      return json(
        { error: "Missing required fields: image, fileName, bucket" },
        { status: 400 },
      );
    }

    // Validate bucket
    if (
      bucket !== STORAGE_BUCKETS.PRODUCT_IMAGES &&
      bucket !== STORAGE_BUCKETS.BRAND_LOGOS
    ) {
      return json(
        {
          error: `Invalid bucket. Must be one of: ${STORAGE_BUCKETS.PRODUCT_IMAGES}, ${STORAGE_BUCKETS.BRAND_LOGOS}`,
        },
        { status: 400 },
      );
    }

    // Generate file path
    const path = generateProductImagePath(entityId || "temp", fileName);

    // Convert base64 to Uint8Array
    const imageBytes = dataUriToUint8Array(image);

    // Get MIME type from filename
    const mimeType = getMimeType(fileName);

    // Upload to Supabase Storage
    const url = await uploadFile(locals.supabaseAdmin, bucket, path, imageBytes, mimeType);

    return json({ url, path }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    return json({ error: errorMessage }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const { bucket, path } = await request.json();

    if (!bucket || !path) {
      return json(
        { error: "Missing required fields: bucket, path" },
        { status: 400 },
      );
    }

    // Validate bucket
    if (
      bucket !== STORAGE_BUCKETS.PRODUCT_IMAGES &&
      bucket !== STORAGE_BUCKETS.BRAND_LOGOS
    ) {
      return json(
        {
          error: `Invalid bucket. Must be one of: ${STORAGE_BUCKETS.PRODUCT_IMAGES}, ${STORAGE_BUCKETS.BRAND_LOGOS}`,
        },
        { status: 400 },
      );
    }

    // Delete from Supabase Storage
    await deleteFile(locals.supabaseAdmin, bucket, path);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to delete file",
      },
      { status: 500 },
    );
  }
};
