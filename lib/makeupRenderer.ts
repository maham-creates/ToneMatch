// Canvas-based makeup rendering utilities

export interface MakeupSettings {
    lipstick: {
        enabled: boolean;
        color: string;
        opacity: number;
    };
    blush: {
        enabled: boolean;
        color: string;
        opacity: number;
    };
    eyeshadow: {
        enabled: boolean;
        color: string;
        opacity: number;
    };
}

/**
 * Render lipstick on the canvas
 */
export function renderLipstick(
    ctx: CanvasRenderingContext2D,
    lipLandmarks: { x: number; y: number }[],
    color: string,
    opacity: number
) {
    if (lipLandmarks.length === 0) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    // Create a path from lip landmarks
    ctx.beginPath();
    ctx.moveTo(lipLandmarks[0].x, lipLandmarks[0].y);

    for (let i = 1; i < lipLandmarks.length; i++) {
        ctx.lineTo(lipLandmarks[i].x, lipLandmarks[i].y);
    }

    ctx.closePath();
    ctx.fill();

    // Add a subtle gradient for depth
    const centerX = lipLandmarks.reduce((sum, p) => sum + p.x, 0) / lipLandmarks.length;
    const centerY = lipLandmarks.reduce((sum, p) => sum + p.y, 0) / lipLandmarks.length;
    const radius = Math.max(
        ...lipLandmarks.map(p => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2))
    );

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
}

/**
 * Render blush on the canvas
 */
export function renderBlush(
    ctx: CanvasRenderingContext2D,
    cheekLandmarks: { x: number; y: number }[],
    color: string,
    opacity: number
) {
    if (cheekLandmarks.length === 0) return;

    ctx.save();
    ctx.globalAlpha = opacity * 0.6; // Blush should be more subtle

    // Calculate center of cheek
    const centerX = cheekLandmarks.reduce((sum, p) => sum + p.x, 0) / cheekLandmarks.length;
    const centerY = cheekLandmarks.reduce((sum, p) => sum + p.y, 0) / cheekLandmarks.length;

    // Create radial gradient for natural blush effect
    const radius = 40;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

/**
 * Render eyeshadow on the canvas
 */
export function renderEyeshadow(
    ctx: CanvasRenderingContext2D,
    eyeLandmarks: { x: number; y: number }[],
    color: string,
    opacity: number
) {
    if (eyeLandmarks.length === 0) return;

    ctx.save();
    ctx.globalAlpha = opacity * 0.7;

    // Create path for eyelid
    ctx.beginPath();
    ctx.moveTo(eyeLandmarks[0].x, eyeLandmarks[0].y);

    for (let i = 1; i < eyeLandmarks.length; i++) {
        ctx.lineTo(eyeLandmarks[i].x, eyeLandmarks[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Add gradient for depth
    const centerX = eyeLandmarks.reduce((sum, p) => sum + p.x, 0) / eyeLandmarks.length;
    const centerY = eyeLandmarks.reduce((sum, p) => sum + p.y, 0) / eyeLandmarks.length;
    const radius = 20;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
}

/**
 * Clear the canvas
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);
}

/**
 * Apply all makeup based on settings
 */
export function applyMakeup(
    ctx: CanvasRenderingContext2D,
    landmarks: {
        lips: { x: number; y: number }[];
        leftCheek: { x: number; y: number }[];
        rightCheek: { x: number; y: number }[];
        leftEye: { x: number; y: number }[];
        rightEye: { x: number; y: number }[];
    },
    settings: MakeupSettings
) {
    // Clear previous makeup
    clearCanvas(ctx, ctx.canvas.width, ctx.canvas.height);

    // Apply makeup in order (back to front)
    if (settings.blush.enabled) {
        renderBlush(ctx, landmarks.leftCheek, settings.blush.color, settings.blush.opacity);
        renderBlush(ctx, landmarks.rightCheek, settings.blush.color, settings.blush.opacity);
    }

    if (settings.eyeshadow.enabled) {
        renderEyeshadow(ctx, landmarks.leftEye, settings.eyeshadow.color, settings.eyeshadow.opacity);
        renderEyeshadow(ctx, landmarks.rightEye, settings.eyeshadow.color, settings.eyeshadow.opacity);
    }

    if (settings.lipstick.enabled) {
        renderLipstick(ctx, landmarks.lips, settings.lipstick.color, settings.lipstick.opacity);
    }
}
