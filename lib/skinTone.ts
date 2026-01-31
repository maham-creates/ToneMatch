// Skin tone detection using simple RGB to HSV conversion

export interface SkinToneResult {
    depth: 'light' | 'medium' | 'deep';
    undertone: 'warm' | 'neutral' | 'cool';
    confidence: 'low' | 'medium' | 'high';
    disclaimer: string;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface HSV {
    h: number;
    s: number;
    v: number;
}

/**
 * Convert RGB to HSV color space
 */
function rgbToHsv(r: number, g: number, b: number): HSV {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = max === 0 ? 0 : delta / max;
    let v = max;

    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / delta + 2) / 6;
        } else {
            h = ((r - g) / delta + 4) / 6;
        }
    }

    return {
        h: h * 360,
        s: s * 100,
        v: v * 100,
    };
}

/**
 * Sample pixels from a region and get average color
 */
function sampleRegion(
    imageData: ImageData,
    points: { x: number; y: number }[],
    sampleSize: number = 20
): RGB {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    // Sample points within the region
    for (let i = 0; i < Math.min(points.length, sampleSize); i++) {
        const point = points[i];
        const x = Math.floor(point.x);
        const y = Math.floor(point.y);

        // Ensure we're within bounds
        if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
            const index = (y * imageData.width + x) * 4;
            totalR += imageData.data[index];
            totalG += imageData.data[index + 1];
            totalB += imageData.data[index + 2];
            count++;
        }
    }

    return {
        r: Math.floor(totalR / count),
        g: Math.floor(totalG / count),
        b: Math.floor(totalB / count),
    };
}

/**
 * Classify skin depth based on HSV value
 */
function classifyDepth(v: number): 'light' | 'medium' | 'deep' {
    if (v > 70) return 'light';
    if (v > 40) return 'medium';
    return 'deep';
}

/**
 * Classify skin undertone based on HSV hue
 */
function classifyUndertone(h: number, s: number): 'warm' | 'neutral' | 'cool' {
    // Warm: yellow/golden tones (20-40 degrees)
    // Neutral: balanced (15-25 or 40-50 degrees)
    // Cool: pink/red tones (0-15 or 340-360 degrees)

    if (h >= 25 && h <= 35 && s > 20) return 'warm';
    if ((h < 15 || h > 340) && s > 15) return 'cool';
    return 'neutral';
}

/**
 * Estimate confidence based on saturation and other factors
 */
function estimateConfidence(s: number, sampleCount: number): 'low' | 'medium' | 'high' {
    // Higher saturation and more samples = higher confidence
    if (s < 10 || sampleCount < 5) return 'low';
    if (s < 20 || sampleCount < 15) return 'medium';
    return 'high';
}

/**
 * Detect skin tone from image using facial landmarks
 */
export function detectSkinTone(
    canvas: HTMLCanvasElement,
    cheekLandmarks: { x: number; y: number }[]
): SkinToneResult {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Get image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Sample the cheek region
    const avgColor = sampleRegion(imageData, cheekLandmarks, 30);

    // Convert to HSV
    const hsv = rgbToHsv(avgColor.r, avgColor.g, avgColor.b);

    // Classify
    const depth = classifyDepth(hsv.v);
    const undertone = classifyUndertone(hsv.h, hsv.s);
    const confidence = estimateConfidence(hsv.s, cheekLandmarks.length);

    return {
        depth,
        undertone,
        confidence,
        disclaimer:
            'Skin tone analysis based on facial features detected by the camera. For best results, ensure good lighting.',
    };
}

/**
 * Get a combined cheek region from left and right cheeks
 */
export function getCombinedCheekRegion(
    leftCheek: { x: number; y: number }[],
    rightCheek: { x: number; y: number }[]
): { x: number; y: number }[] {
    return [...leftCheek, ...rightCheek];
}
