// Canvas-based makeup rendering utilities

import { FacialLandmarks } from '@/lib/mediapipe-video';

export type AccessoryCategory = 'glasses' | 'earrings' | 'hat' | 'generic';

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
    accessory?: {
        image: HTMLImageElement | null;
        opacity: number;
        category?: AccessoryCategory;
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
 * Render blush on the canvas with natural elliptical contour
 */
export function renderBlush(
    ctx: CanvasRenderingContext2D,
    cheekLandmarks: { x: number; y: number }[],
    color: string,
    opacity: number
) {
    if (cheekLandmarks.length === 0) return;

    ctx.save();
    ctx.globalAlpha = opacity * 0.7; // Blush should be visible

    // Calculate center of cheek
    const centerX = cheekLandmarks.reduce((sum, p) => sum + p.x, 0) / cheekLandmarks.length;
    const centerY = cheekLandmarks.reduce((sum, p) => sum + p.y, 0) / cheekLandmarks.length;

    // Calculate the bounds of cheek landmarks to determine direction and size
    const minX = Math.min(...cheekLandmarks.map(p => p.x));
    const maxX = Math.max(...cheekLandmarks.map(p => p.x));
    const minY = Math.min(...cheekLandmarks.map(p => p.y));
    const maxY = Math.max(...cheekLandmarks.map(p => p.y));

    const width = maxX - minX;
    const height = maxY - minY;

    // Create elliptical gradient that sweeps upward and inward
    // Smaller radiuses to stay on cheek, not reach eyes
    const radiusX = Math.max(width * 0.25, 15);
    const radiusY = Math.max(height * 0.4, 20);

    // Offset the gradient center slightly upward and inward to follow natural application
    const gradientCenterX = centerX - width * 0.2;
    const gradientCenterY = centerY - height * 0.4;

    // Parse color to add alpha channel
    const parseColor = (col: string) => {
        if (col.startsWith('#')) {
            const hex = col.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return col;
    };

    const rgbColor = parseColor(color);

    // Draw multiple layers for more defined appearance

    // Layer 1: Base gradient fill
    ctx.save();
    ctx.translate(gradientCenterX, gradientCenterY);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(radiusX, radiusY));
    gradient.addColorStop(0, rgbColor);
    gradient.addColorStop(0.3, `${rgbColor.replace('rgb', 'rgba').replace(')', ', 0.7)')}`);
    gradient.addColorStop(0.6, `${rgbColor.replace('rgb', 'rgba').replace(')', ', 0.3)')}`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;

    // Draw main elliptical blush shape
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Layer 2: Add defined stroke for edge definition
    ctx.strokeStyle = `${rgbColor.replace('rgb', 'rgba').replace(')', ', 0.4)')}`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, -0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Layer 3: Add secondary arc for contouring (sweep effect)
    ctx.strokeStyle = `${rgbColor.replace('rgb', 'rgba').replace(')', ', 0.35)')}`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(radiusX * 0.3, -radiusY * 0.15, radiusX * 0.7, 0.5, Math.PI * 1.4);
    ctx.stroke();

    // Layer 4: Add highlight arc for natural depth
    const highlightGradient = ctx.createLinearGradient(-radiusX * 0.5, -radiusY * 0.3, radiusX * 0.5, radiusY * 0.3);
    highlightGradient.addColorStop(0, `${rgbColor.replace('rgb', 'rgba').replace(')', ', 0.2)')}`);
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.ellipse(0, -radiusY * 0.2, radiusX * 0.8, radiusY * 0.5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
 * Render an accessory image focused on specific facial regions
 */
export function renderAccessory(
    ctx: CanvasRenderingContext2D,
    landmarks: { x: number; y: number }[],
    image: HTMLImageElement,
    opacity: number,
    category: 'glasses' | 'earrings' | 'hat' | 'generic' = 'generic'
) {
    if (landmarks.length < 468 || !image.complete) return;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (category === 'glasses' || category === 'generic') {
        // Use eye corners (indices 33 and 263) and nose bridge (168)
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const noseBridge = landmarks[168];

        const dx = rightEye.x - leftEye.x;
        const dy = rightEye.y - leftEye.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        ctx.translate(noseBridge.x, noseBridge.y);
        ctx.rotate(angle);
        const scale = distance / (image.width * 0.5);
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
    } else if (category === 'earrings') {
        // Render on both ear lobes (indices 132 and 361)
        const leftLobe = landmarks[132];
        const rightLobe = landmarks[361];
        const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x);
        const scale = (faceWidth / image.width) * 0.15; // Small scale for earrings

        // Left earring
        ctx.save();
        ctx.translate(leftLobe.x, leftLobe.y);
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, 0); // Hang from the lobe
        ctx.restore();

        // Right earring
        ctx.save();
        ctx.translate(rightLobe.x, rightLobe.y);
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, 0);
        ctx.restore();
    } else if (category === 'hat') {
        // Render on top of head (index 10 is crown/top center)
        const topCenter = landmarks[10];
        const leftTemple = landmarks[127];
        const rightTemple = landmarks[356];

        const dx = rightTemple.x - leftTemple.x;
        const dy = rightTemple.y - leftTemple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        ctx.translate(topCenter.x, topCenter.y);
        ctx.rotate(angle);
        const scale = (distance / image.width) * 1.5; // Hats should be wider than face
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, -image.height * 0.8); // Offset upward to sit ON head
    }

    ctx.restore();
}

/**
 * Clear the canvas
 */
export function cleanupCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);
}

/**
 * Apply all makeup based on settings
 */
export function applyMakeup(
    ctx: CanvasRenderingContext2D,
    landmarks: FacialLandmarks,
    settings: MakeupSettings
) {
    // Clear previous makeup
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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

    if (settings.accessory?.image && settings.accessory.image.complete) {
        renderAccessory(
            ctx,
            landmarks.allLandmarks,
            settings.accessory.image,
            settings.accessory.opacity,
            settings.accessory.category
        );
    }
}
