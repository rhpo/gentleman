import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProductById } from "$lib/api/server/products";
import { getBrands } from "$lib/api/server/brands";

export const load: PageServerLoad = async ({ params, locals }) => {
    const productId = Number(params.id);

    try {
        const product = await getProductById(locals.supabase, productId);

        if (!product) {
            throw error(404, "Product not found");
        }

        const brands = await getBrands(locals.supabase);

        return { product, brands };
    } catch (err) {
        if (err instanceof Error && 'status' in (err as any)) throw err;
        console.error("Error loading product:", err);
        throw error(500, "Failed to load product");
    }
};
