/**
 * Cloudflare Worker: Gentlemandz Storage CDN Proxy
 * Custom Domain: https://cdn.gentlemandz.com
 *
 * Proxies public Supabase storage requests for two buckets:
 * - brand-logos   => https://ysmbrnptopcrodnbfzyk.supabase.co/storage/v1/object/public/brand-logos/*
 * - product-images => https://ysmbrnptopcrodnbfzyk.supabase.co/storage/v1/object/public/product-images/*
 */

const SUPABASE_STORAGE_BASE = "https://ysmbrnptopcrodnbfzyk.supabase.co/storage/v1/object/public";
const ALLOWED_BUCKETS = new Set(["brand-logos", "product-images"]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname; // e.g., /brand-logos/brands/logo_123.jpg or /product-images/products/img_456.jpg

    // Extract bucket name from path (first path segment)
    const segments = pathname.split("/").filter(Boolean);
    const bucket = segments[0];

    // Restrict proxying strictly to allowed public buckets
    if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
      return new Response("Forbidden or bucket not allowed", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Construct upstream Supabase URL
    const targetUrl = `${SUPABASE_STORAGE_BASE}${pathname}${url.search}`;

    // Check Cloudflare Edge Cache
    const cache = caches.default;
    let response = await cache.match(request);

    if (response) {
      return response;
    }

    // Fetch from Supabase Storage upstream
    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Accept: request.headers.get("Accept") || "*/*",
        "User-Agent": "Gentleman-Cloudflare-Worker-CDN",
      },
    });

    if (!upstreamResponse.ok) {
      return upstreamResponse;
    }

    // Add cache headers and CORS headers
    const newHeaders = new Headers(upstreamResponse.headers);
    newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    response = new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: newHeaders,
    });

    // Store response in Cloudflare Edge Cache asynchronously if request is GET
    if (request.method === "GET") {
      ctx.waitUntil(cache.put(request, response.clone()));
    }

    return response;
  },
};
