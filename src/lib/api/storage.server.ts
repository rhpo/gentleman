import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/database";

/**
 * Pure storage utilities.
 * These do NOT import environment variables directly.
 * The caller must provide a configured SupabaseClient (usually an admin/service-role client).
 */

/**
 * Upload a file and return its public URL.
 */
export async function uploadFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string,
  file: Uint8Array | Buffer,
  contentType: string = "image/jpeg"
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: false });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string
): Promise<void> {
  if (!path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.warn(`Storage deletion warning: ${error.message}`);
  }
}
