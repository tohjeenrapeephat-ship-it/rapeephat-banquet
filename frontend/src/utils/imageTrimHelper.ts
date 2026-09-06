/**
 * 🍽️ Image Trim & Sanitization Helper
 * Automatically detects and crops uneven white/light/transparent border margins
 * from any dish image URL (preset, external URL, or base64 DataURL).
 */

const trimmedCache = new Map<string, string>();
const inFlightPromises = new Map<string, Promise<string>>();

/**
 * Check if an RGB color is white / near-white / transparent background
 */
function isLightBorderPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 30) return true; // Transparent
  // Near white (R, G, B > 230) or very light grey
  if (r > 230 && g > 230 && b > 230) return true;
  // Also check if colors are nearly equal and bright (> 225)
  if (r > 225 && g > 225 && b > 225 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) return true;
  return false;
}

/**
 * Scan canvas pixels and crop out solid white or blank margins on all 4 sides.
 */
export function trimCanvasWhiteMargins(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  if (width < 40 || height < 40) return canvas;

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const getPixel = (x: number, y: number) => {
      const idx = (y * width + x) * 4;
      return {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
        a: data[idx + 3],
      };
    };

    let left = 0;
    let right = width - 1;
    let top = 0;
    let bottom = height - 1;

    // 1. Scan Left margin (up to 35% of image width)
    const maxScanX = Math.floor(width * 0.35);
    for (let x = 0; x < maxScanX; x++) {
      let borderPixels = 0;
      let totalSampled = 0;
      for (let y = 0; y < height; y += 2) {
        totalSampled++;
        const p = getPixel(x, y);
        if (isLightBorderPixel(p.r, p.g, p.b, p.a)) {
          borderPixels++;
        }
      }
      // If > 90% of column pixels are border color, mark as margin
      if (borderPixels / totalSampled >= 0.90) {
        left = x + 1;
      } else {
        break;
      }
    }

    // 2. Scan Right margin (up to 35% of image width)
    const minScanX = Math.floor(width * 0.65);
    for (let x = width - 1; x >= minScanX; x--) {
      let borderPixels = 0;
      let totalSampled = 0;
      for (let y = 0; y < height; y += 2) {
        totalSampled++;
        const p = getPixel(x, y);
        if (isLightBorderPixel(p.r, p.g, p.b, p.a)) {
          borderPixels++;
        }
      }
      if (borderPixels / totalSampled >= 0.90) {
        right = x - 1;
      } else {
        break;
      }
    }

    // 3. Scan Top margin (up to 35% of image height)
    const maxScanY = Math.floor(height * 0.35);
    for (let y = 0; y < maxScanY; y++) {
      let borderPixels = 0;
      let totalSampled = 0;
      for (let x = left; x <= right; x += 2) {
        totalSampled++;
        const p = getPixel(x, y);
        if (isLightBorderPixel(p.r, p.g, p.b, p.a)) {
          borderPixels++;
        }
      }
      if (borderPixels / totalSampled >= 0.90) {
        top = y + 1;
      } else {
        break;
      }
    }

    // 4. Scan Bottom margin (up to 35% of image height)
    const minScanY = Math.floor(height * 0.65);
    for (let y = height - 1; y >= minScanY; y--) {
      let borderPixels = 0;
      let totalSampled = 0;
      for (let x = left; x <= right; x += 2) {
        totalSampled++;
        const p = getPixel(x, y);
        if (isLightBorderPixel(p.r, p.g, p.b, p.a)) {
          borderPixels++;
        }
      }
      if (borderPixels / totalSampled >= 0.90) {
        bottom = y - 1;
      } else {
        break;
      }
    }

    const cropWidth = right - left + 1;
    const cropHeight = bottom - top + 1;

    // If any border was detected and remaining image is valid
    if (
      cropWidth >= 40 &&
      cropHeight >= 40 &&
      (left > 0 || right < width - 1 || top > 0 || bottom < height - 1)
    ) {
      const trimmedCanvas = document.createElement('canvas');
      trimmedCanvas.width = cropWidth;
      trimmedCanvas.height = cropHeight;
      const trimmedCtx = trimmedCanvas.getContext('2d');
      if (trimmedCtx) {
        trimmedCtx.drawImage(
          canvas,
          left,
          top,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
        return trimmedCanvas;
      }
    }
  } catch (err) {
    console.warn('Auto-trimming notice:', err);
  }

  return canvas;
}

/**
 * Load an image URL and return a trimmed DataURL if white margins exist
 */
export function getAutoTrimmedImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl || typeof window === 'undefined') {
    return Promise.resolve(imageUrl);
  }

  if (trimmedCache.has(imageUrl)) {
    return Promise.resolve(trimmedCache.get(imageUrl)!);
  }

  if (inFlightPromises.has(imageUrl)) {
    return inFlightPromises.get(imageUrl)!;
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    if (!imageUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          trimmedCache.set(imageUrl, imageUrl);
          resolve(imageUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const trimmed = trimCanvasWhiteMargins(canvas);
        const resultUrl = trimmed.toDataURL('image/jpeg', 0.92);
        trimmedCache.set(imageUrl, resultUrl);
        resolve(resultUrl);
      } catch (err) {
        trimmedCache.set(imageUrl, imageUrl);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      trimmedCache.set(imageUrl, imageUrl);
      resolve(imageUrl);
    };

    img.src = imageUrl;
  }).finally(() => {
    inFlightPromises.delete(imageUrl);
  });

  inFlightPromises.set(imageUrl, promise);
  return promise;
}
