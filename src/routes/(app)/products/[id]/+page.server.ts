import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProductById } from "$lib/api/products";

export const load: PageServerLoad = async ({ params }) => {
    const productId = Number(params.id);

    try {
        const product = await getProductById(productId);

        if (!product) {
            throw error(404, "Product not found");
        }

        return { product };
    } catch (err) {
        console.error("Error loading product:", err);
        throw error(500, "Failed to load product");
    }
};
