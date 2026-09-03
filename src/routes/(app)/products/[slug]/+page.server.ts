import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProductById, getProducts } from "$lib/api/server/products";
import { slugify } from "$lib/utils/search";
import { getDominantColorServer } from "$lib/utils/palette";

export const load: PageServerLoad = async ({ params, locals }) => {
    const productSlug = params.slug;
    const productId = Number(productSlug.split("-")[0]);

    const slug = productSlug.split("-").slice(1).join("-");

    if (isNaN(productId)) {
        throw error(404, "Product not found");
    }

    let product;

    try {
        product = await getProductById(locals.supabase, productId);
    } catch (err) {
        console.error("Error loading product:", err);
        throw error(500, "Failed to load product");
    }

    if (!product) {
        throw error(404, "Product not found");
    }

    const correctSlug = slugify(product.name);

    if (slug !== correctSlug) {
        throw redirect(301, `/products/${product.id}-${correctSlug}`);
    }

    let recommendations: any[] = [];
    const brandName = product.brands?.name || product.brand;
    try {
        if (brandName) {
            const sameBrandProducts = await getProducts(locals.supabase, { brand: brandName });
            recommendations = sameBrandProducts.filter((p) => p.id !== product.id);
        }
        if (recommendations.length < 8) {
            const allProducts = await getProducts(locals.supabase);
            const additional = allProducts.filter(
                (p) => p.id !== product.id && !recommendations.some((r) => r.id === p.id)
            );
            recommendations = [...recommendations, ...additional];
        }
        recommendations = recommendations.slice(0, 12);
    } catch (err) {
        console.error("Error loading recommendations:", err);
    }

    let dominantColor: string | null = null;

    try {
        const palette = await getDominantColorServer(product.image);
        dominantColor = palette?.colorCSS ?? null;
    } catch (err) {
        console.error("Error loading dominant color:", err);
    }

    return { product, recommendations, dominantColor };
};
