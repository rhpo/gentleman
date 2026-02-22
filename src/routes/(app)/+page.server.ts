import type { PageServerLoad } from "./$types";
import { getBrands } from "$lib/api/server/brands";
import { getProducts } from "$lib/api/server/products";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const [products, brands] = await Promise.all([
      getProducts(locals.supabase),
      getBrands(locals.supabase)
    ]);

    // For home page, we only wanted 4 featured products
    const featuredProducts = products.slice(0, 4).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? "",
      type: product.type,
      brand: (product as any).brands?.name,
    }));

    return {
      featuredProducts,
      brands,
    };
  } catch (err) {
    console.error("Error loading home page data:", err);
    return {
      featuredProducts: [],
      brands: [],
    };
  }
};
