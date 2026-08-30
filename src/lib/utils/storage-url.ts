import { STORAGE_BUCKETS } from '$lib/constants/storage';

export const CDN_BASE_URL = 'https://cdn.gentlemandz.com';
export const SUPABASE_STORAGE_PATH_REGEX = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)/;

/**
 * Transforms a Supabase public storage URL, CDN URL, or relative storage path
 * into a Cloudflare CDN URL (https://cdn.gentlemandz.com/<bucket>/<path>).
 *
 * Examples:
 * - Supabase URL: https://ysmbrnptopcrodnbfzyk.supabase.co/storage/v1/object/public/brand-logos/products/foo.webp
 *   => https://cdn.gentlemandz.com/brand-logos/products/foo.webp
 * - CDN URL: https://cdn.gentlemandz.com/product-images/products/foo.webp
 *   => https://cdn.gentlemandz.com/product-images/products/foo.webp (unchanged)
 * - Path with bucket: brand-logos/products/foo.webp
 *   => https://cdn.gentlemandz.com/brand-logos/products/foo.webp
 * - Path without bucket (bucket passed): products/foo.webp, 'product-images'
 *   => https://cdn.gentlemandz.com/product-images/products/foo.webp
 * - null/undefined => returns null/undefined
 */
export function toCdnStorageUrl<T extends string | null | undefined>(
  urlOrPath: T,
  bucket?: string
): T {
  if (urlOrPath === null || urlOrPath === undefined || urlOrPath === '') {
    return urlOrPath;
  }

  const str = urlOrPath.trim();

  // 1. If it's already a CDN URL (or matching cdn.gentlemandz.com)
  if (str.startsWith(CDN_BASE_URL)) {
    return str as T;
  }

  // 2. If it's a Supabase storage URL
  // Matches: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const supabaseMatch = str.match(SUPABASE_STORAGE_PATH_REGEX);
  if (supabaseMatch) {
    const [, matchedBucket, matchedPath] = supabaseMatch;
    return `${CDN_BASE_URL}/${matchedBucket}/${matchedPath}` as T;
  }

  // Handle any generic http(s) URL that contains /storage/v1/object/public/
  if (str.startsWith('http://') || str.startsWith('https://')) {
    if (str.includes('/storage/v1/object/public/')) {
      const parts = str.split('/storage/v1/object/public/');
      if (parts[1]) {
        return `${CDN_BASE_URL}/${parts[1]}` as T;
      }
    }
    // External non-Supabase HTTP URL: return as is
    return str as T;
  }

  // 3. Relative path handling
  // Clean leading slashes
  const cleanPath = str.replace(/^\/+/, '');

  // Check if cleanPath already starts with known buckets: brand-logos/ or product-images/
  if (cleanPath.startsWith(`${STORAGE_BUCKETS.BRAND_LOGOS}/`) || cleanPath.startsWith(`${STORAGE_BUCKETS.PRODUCT_IMAGES}/`)) {
    return `${CDN_BASE_URL}/${cleanPath}` as T;
  }

  // If a bucket was explicitly passed in:
  if (bucket) {
    const cleanBucket = bucket.replace(/^\/+|\/+$/g, '');
    return `${CDN_BASE_URL}/${cleanBucket}/${cleanPath}` as T;
  }

  // Default fallback: return as cleanPath with CDN prefix
  return `${CDN_BASE_URL}/${cleanPath}` as T;
}

/**
 * Extract the file path within a bucket from either a Supabase storage URL, CDN URL, or path.
 *
 * Examples:
 * - https://ysmbrnptopcrodnbfzyk.supabase.co/storage/v1/object/public/brand-logos/products/foo.webp => products/foo.webp
 * - https://cdn.gentlemandz.com/brand-logos/products/foo.webp => products/foo.webp
 * - brand-logos/products/foo.webp => products/foo.webp
 * - products/foo.webp => products/foo.webp
 */
export function extractPathFromUrl(urlOrPath: string | null | undefined): string {
  if (!urlOrPath) return '';

  const str = urlOrPath.trim();

  // 1. Check Supabase URL pattern
  const supabaseMatch = str.match(SUPABASE_STORAGE_PATH_REGEX);
  if (supabaseMatch) {
    return supabaseMatch[2]; // <path>
  }

  // 2. Check CDN URL pattern: https://cdn.gentlemandz.com/<bucket>/<path>
  if (str.startsWith(CDN_BASE_URL)) {
    const withoutCdn = str.slice(CDN_BASE_URL.length).replace(/^\/+/, '');
    const firstSlashIndex = withoutCdn.indexOf('/');
    if (firstSlashIndex !== -1) {
      return withoutCdn.slice(firstSlashIndex + 1);
    }
    return withoutCdn;
  }

  // 3. Handle http(s) URL with /storage/v1/object/public/
  if (str.startsWith('http://') || str.startsWith('https://')) {
    const match = str.match(/\/object\/public\/[^/]+\/(.+)/);
    if (match) return match[1];
  }

  // 4. Relative paths: if starts with bucket name (e.g. brand-logos/products/foo.jpg)
  const cleanPath = str.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${STORAGE_BUCKETS.BRAND_LOGOS}/`) || cleanPath.startsWith(`${STORAGE_BUCKETS.PRODUCT_IMAGES}/`)) {
    const firstSlashIndex = cleanPath.indexOf('/');
    return cleanPath.slice(firstSlashIndex + 1);
  }

  return cleanPath;
}
