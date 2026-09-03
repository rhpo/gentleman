/**
 * Palette Utility — Color Extraction Plugin
 *
 * Provides getDominantColor(imageSource) for extracting the dominant
 * non-white, non-background color from a product image.
 *
 * Works in two contexts:
 *   - Browser: uses an <img> element + extract-colors (canvas)
 *   - Server (Node.js): fetches the image and uses extract-colors with node-canvas or jimp (optional)
 *
 * Returns:
 *   { colors: { r, g, b }, colorCSS: string }  on success
 *   null                                         on failure / no dominant color
 *
 * Usage (browser, Svelte action / onload):
 *   import { getDominantColor } from "$lib/utils/palette";
 *   const result = await getDominantColor(img.src);
 *   if (result) el.style.setProperty("--dominant", result.colorCSS);
 *
 * Usage (server):
 *   import { getDominantColor } from "$lib/utils/palette";
 *   const result = await getDominantColor("https://cdn.example.com/img.png");
 *
 * To disable globally: set PALETTE_CONFIG.enabled = false
 */

export interface PaletteConfig {
  enabled: boolean;
  /** Minimum alpha for a pixel to count (0-255) */
  minAlpha: number;
  /** If ALL of r, g, b are above this value the pixel is considered background/white */
  whitenessThreshold: number;
  /** Distance between color clusters (0-1). Higher = fewer, broader clusters */
  distance: number;
  /** Opacity applied to the returned colorCSS rgba value */
  colorOpacity: number;
}

export const PALETTE_CONFIG: PaletteConfig = {
  enabled: true,
  minAlpha: 250,
  whitenessThreshold: 220,
  distance: 0.2,
  colorOpacity: 1,
};

export interface DominantColorResult {
  colors: { r: number; g: number; b: number };
  colorCSS: string;
}

// In-browser in-memory cache: imageURL -> result
const cache = new Map<string, DominantColorResult | null>();

/**
 * Given an image URL (or data-URI), returns the dominant non-white color.
 * Works in both browser and Node.js environments.
 */
export async function getDominantColor(
  imageSource: string,
  config: Partial<PaletteConfig> = {},
): Promise<DominantColorResult | null> {
  if (!imageSource) return null;
  const cfg = { ...PALETTE_CONFIG, ...config };
  if (!cfg.enabled) return null;

  // Serve from cache
  if (cache.has(imageSource)) return cache.get(imageSource)!;

  try {
    const { extractColors } = await import("extract-colors");

    const colors = await extractColors(imageSource, {
      colorValidator: (r: number, g: number, b: number, alpha: number = 255) =>
        alpha > cfg.minAlpha &&
        !(r > cfg.whitenessThreshold && g > cfg.whitenessThreshold && b > cfg.whitenessThreshold),
      distance: cfg.distance,
    });

    if (!colors || colors.length === 0) {
      cache.set(imageSource, null);
      return null;
    }

    const c = colors[0];
    const result: DominantColorResult = {
      colors: { r: c.red, g: c.green, b: c.blue },
      colorCSS: `rgba(${c.red},${c.green},${c.blue},${cfg.colorOpacity})`,
    };
    cache.set(imageSource, result);
    return result;
  } catch (err) {
    console.warn("[palette] getDominantColor failed:", err);
    cache.set(imageSource, null);
    return null;
  }
}

/**
 * Server-compatible version — fetches the image and samples colors using extract-colors.
 *
 * NOTE: extract-colors uses the Canvas API internally when passed a URL string.
 * On the server (Node.js without canvas), pass a pixel data object instead.
 * If no image decoding library (e.g. jimp, sharp) is available, this returns null gracefully.
 *
 * To enable full server-side support: install `jimp` (`pnpm add jimp`) and uncomment the jimp block.
 */
export async function getDominantColorServer(
  imageUrl: string,
  config: Partial<PaletteConfig> = {},
): Promise<DominantColorResult | null> {
  if (!imageUrl) return null;
  const cfg = { ...PALETTE_CONFIG, ...config };
  if (!cfg.enabled) return null;

  if (cache.has(imageUrl)) return cache.get(imageUrl)!;

  try {
    const Jimp = ((await import("jimp")).Jimp);
    const { extractColors } = await import("extract-colors");

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const img = await Jimp.read(buffer);
    img.resize({ w: 64, h: 64 });

    const width = img.bitmap.width;
    const height = img.bitmap.height;
    // extract-colors accepts a flat number[] of RGBA values
    const data = Array.from(img.bitmap.data as Uint8Array);
    const colors = await extractColors(
      { data, width, height },
      {
        colorValidator: (r, g, b, alpha = 255) =>
          alpha > cfg.minAlpha &&
          !(r > cfg.whitenessThreshold && g > cfg.whitenessThreshold && b > cfg.whitenessThreshold),
        distance: cfg.distance,
      },
    );
    if (colors && colors.length > 0) {
      const c = colors[0];
      const result: DominantColorResult = {
        colors: { r: c.red, g: c.green, b: c.blue },
        colorCSS: `rgba(${c.red},${c.green},${c.blue},${cfg.colorOpacity})`,
      };
      cache.set(imageUrl, result);
      return result;
    }

    cache.set(imageUrl, null);
    return null;
  } catch (err) {
    console.warn("[palette] getDominantColorServer failed:", err);
    cache.set(imageUrl, null);
    return null;
  }
}
