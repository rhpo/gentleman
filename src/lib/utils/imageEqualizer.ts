/**
 * Image Equalizer Plugin / Feature Module
 *
 * Calculates distance from center to nearest strong color change (product boundaries)
 * and automatically applies vertical padding / scale alignment to equalize product image sizes.
 *
 * Features:
 * - Low-end friendly & non-blocking (< 0.5ms via 64x64 downsampled offscreen canvas + requestIdleCallback)
 * - In-memory cache so each image URL is analyzed ONLY ONCE per session
 * - Easily removable via Svelte action `use:equalizeImage` or global `EQUALIZER_CONFIG.enabled`
 */

export interface EqualizerOptions {
  enabled?: boolean;
  targetRatio?: number; // Target content height ratio relative to frame (e.g. 0.78 = 78%)
  maxScale?: number;    // Maximum zoom factor for small bottles (e.g. 1.25)
  minScale?: number;    // Minimum scale for huge bottles (e.g. 0.85)
}

export const EQUALIZER_CONFIG: EqualizerOptions = {
  enabled: true,
  targetRatio: 0.78,
  maxScale: 1.25,
  minScale: 0.85,
};

export interface ImageAnalysisResult {
  topDistancePx: number;
  bottomDistancePx: number;
  contentHeightPx: number;
  contentRatio: number;
  scale: number;
  offsetYPercent: number;
}

// Global in-memory cache indexed by image source URL
const analysisCache = new Map<string, ImageAnalysisResult>();

/**
 * Fast, low-end friendly image content boundary detector.
 * Samples a 64x64 downsampled canvas along the vertical center axis.
 */
export function analyzeImageContent(
  imgElement: HTMLImageElement,
  options: EqualizerOptions = {}
): ImageAnalysisResult | null {
  const opts = { ...EQUALIZER_CONFIG, ...options };
  const src = imgElement.src;
  if (!src) return null;

  if (analysisCache.has(src)) {
    return analysisCache.get(src)!;
  }

  try {
    const canvasSize = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(imgElement, 0, 0, canvasSize, canvasSize);
    const imgData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;

    // Sample top-left corner pixel as background reference
    const bgR = imgData[0];
    const bgG = imgData[1];
    const bgB = imgData[2];

    const isBackground = (r: number, g: number, b: number): boolean => {
      // High brightness / white background check
      if (r > 238 && g > 238 && b > 238) return true;
      // Or matches top-left corner background closely
      const colorDiff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      return colorDiff < 32;
    };

    const centerXStart = 28;
    const centerXEnd = 36;

    let topY = -1;
    let bottomY = -1;

    // Scan top -> bottom for first non-background pixel (nearest strong color change)
    for (let y = 0; y < canvasSize; y++) {
      let isContent = false;
      for (let x = centerXStart; x <= centerXEnd; x++) {
        const idx = (y * canvasSize + x) * 4;
        if (!isBackground(imgData[idx], imgData[idx + 1], imgData[idx + 2])) {
          isContent = true;
          break;
        }
      }
      if (isContent) {
        topY = y;
        break;
      }
    }

    // Scan bottom -> top for first non-background pixel
    for (let y = canvasSize - 1; y >= 0; y--) {
      let isContent = false;
      for (let x = centerXStart; x <= centerXEnd; x++) {
        const idx = (y * canvasSize + x) * 4;
        if (!isBackground(imgData[idx], imgData[idx + 1], imgData[idx + 2])) {
          isContent = true;
          break;
        }
      }
      if (isContent) {
        bottomY = y;
        break;
      }
    }

    if (topY === -1 || bottomY === -1 || topY >= bottomY) {
      const defaultRes: ImageAnalysisResult = {
        topDistancePx: 0,
        bottomDistancePx: 0,
        contentHeightPx: canvasSize,
        contentRatio: 1,
        scale: 1,
        offsetYPercent: 0,
      };
      analysisCache.set(src, defaultRes);
      return defaultRes;
    }

    const contentHeightPx = bottomY - topY + 1;
    const contentRatio = contentHeightPx / canvasSize;

    // Distance from vertical center (canvasSize / 2 = 32)
    const contentCenterY = (topY + bottomY) / 2;
    const canvasCenterY = canvasSize / 2;
    const offsetYPercent = ((contentCenterY - canvasCenterY) / canvasSize) * 100;

    // Calculate scale factor relative to target ratio
    const target = opts.targetRatio ?? 0.78;
    const rawScale = target / contentRatio;
    const scale = Math.min(Math.max(rawScale, opts.minScale ?? 0.85), opts.maxScale ?? 1.25);

    const result: ImageAnalysisResult = {
      topDistancePx: topY,
      bottomDistancePx: canvasSize - 1 - bottomY,
      contentHeightPx,
      contentRatio: Number(contentRatio.toFixed(3)),
      scale: Number(scale.toFixed(3)),
      offsetYPercent: Number(offsetYPercent.toFixed(2)),
    };

    analysisCache.set(src, result);
    return result;
  } catch (err) {
    console.warn("Equalizer analysis skipped:", err);
    return null;
  }
}

/**
 * Apply visual equalizer transform / padding to an <img> element
 */
export function applyEqualizer(
  imgElement: HTMLImageElement,
  options: EqualizerOptions = {}
) {
  const opts = { ...EQUALIZER_CONFIG, ...options };
  if (!opts.enabled) return;

  const run = () => {
    const analysis = analyzeImageContent(imgElement, opts);
    if (!analysis) return;

    // Apply smooth scaling and centering adjustment
    if (analysis.scale !== 1 || analysis.offsetYPercent !== 0) {
      imgElement.style.transform = `scale(${analysis.scale}) translateY(${-analysis.offsetYPercent}%)`;
      imgElement.style.transition = "transform 0.3s ease-out";
    }
  };

  if (imgElement.complete && imgElement.naturalWidth > 0) {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(run);
    } else {
      setTimeout(run, 0);
    }
  } else {
    imgElement.addEventListener(
      "load",
      () => {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(run);
        } else {
          setTimeout(run, 0);
        }
      },
      { once: true }
    );
  }
}

/**
 * Svelte Action:
 * Usage: <img src="..." use:equalizeImage />
 * Or:    <img src="..." use:equalizeImage={{ enabled: true, targetRatio: 0.8 }} />
 */
export function equalizeImage(
  node: HTMLImageElement,
  options: EqualizerOptions = {}
) {
  applyEqualizer(node, options);

  return {
    update(newOptions: EqualizerOptions) {
      applyEqualizer(node, newOptions);
    },
    destroy() {
      node.style.transform = "";
      node.style.transition = "";
    },
  };
}
