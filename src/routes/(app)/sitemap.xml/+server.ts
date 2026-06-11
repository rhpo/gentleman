import { env } from '$env/dynamic/public';

import type { RequestHandler } from './$types';
import { getProducts } from '$lib/api/server/products';

export const GET: RequestHandler = async ({ locals }) => {
    // Determine the base URL
    const siteUrl = env.PUBLIC_SITE_URL || 'https://www.gentlemandz.com';

    const pages = [
        '',
        '/products',
        '/wishlist'
    ];

    const urls: string[] = [];

    // Add static pages
    for (const page of pages) {
        urls.push(`${siteUrl}${page}`);
    }

    try {
        // Query all products from the database using the existing ORM helper
        const products = await getProducts(locals.supabase);

        // Add a url entry for each product
        if (products && Array.isArray(products)) {
            for (const product of products) {
                urls.push(`${siteUrl}/products/${product.id}`);
            }
        }
    } catch (err) {
        console.error('Error fetching products for sitemap:', err);
        // We still generate the sitemap for static pages even if DB query fails
    }

    // Generate the XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === siteUrl || url === siteUrl + '/' ? '1.0' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
};
