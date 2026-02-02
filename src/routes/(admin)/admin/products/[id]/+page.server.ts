import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProductsServer } from "$lib/api/services/productsService";
import { getBrandsServer } from "$lib/api/services/brandsService";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const productId = Number(params.id);

    try {
        const products = await getProductsServer(cookies);
        const product = products.find((p) => p.id === productId);

        if (!product) {
            throw error(404, "Product not found");
        }

        const brands = await getBrandsServer(cookies);

        return { product, brands };
    } catch (err) {
        console.error("Error loading product:", err);
        throw error(500, "Failed to load product");
    }
};
