import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/database";
import type { Brand, BrandInput } from "$lib/types/entities";
import { getBrands, getBrandById } from "../brands";
import { deleteFile } from "../storage.server";
import { extractPathFromUrl } from "../storage";
import { STORAGE_BUCKETS } from "$lib/constants/storage";

export { getBrands, getBrandById };

/**
 * Create a brand
 */
export async function createBrand(
  supabase: SupabaseClient<Database>,
  brand: BrandInput
): Promise<Brand> {
  const { data, error } = await (supabase.from("brands") as any)
    .insert([brand])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Brand;
}

/**
 * Update a brand
 */
export async function updateBrand(
  supabase: SupabaseClient<Database>,
  id: number,
  brand: Partial<BrandInput>
): Promise<Brand> {
  const { data, error } = await (supabase.from("brands") as any)
    .update(brand)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Brand;
}

/**
 * Delete a brand and its logo
 */
export async function deleteBrand(
  supabase: SupabaseClient<Database>,
  supabaseAdmin: SupabaseClient<Database>,
  id: number
): Promise<void> {
  // Get the brand to find logo path before deleting
  const { data: brandData } = await supabase
    .from("brands")
    .select("logo")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Delete logo from storage
  if ((brandData as any)?.logo) {
    const logoPath = extractPathFromUrl((brandData as any).logo);
    if (logoPath) {
      await deleteFile(supabaseAdmin, STORAGE_BUCKETS.BRAND_LOGOS, logoPath).catch(
        (err: unknown) => {
          console.error("Failed to delete brand logo:", err);
        }
      );
    }
  }
}
