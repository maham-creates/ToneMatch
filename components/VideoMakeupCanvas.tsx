'use client';

import { useEffect, useRef, useState } from 'react';
import { applyMakeup, MakeupSettings, AccessoryCategory } from '@/lib/makeupRenderer';
import { FacialLandmarks } from '@/lib/mediapipe-video';

interface VideoMakeupCanvasProps {
    videoElement: HTMLVideoElement | null;
    landmarks: FacialLandmarks | null;
    makeupSettings: MakeupSettings;
    accessoryImage?: string | null;
    accessoryCategory?: AccessoryCategory;
}

export default function VideoMakeupCanvas({
    videoElement,
    landmarks,
    makeupSettings,
    accessoryImage,
    accessoryCategory = 'glasses'
}: VideoMakeupCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loadedAccessoryImage, setLoadedAccessoryImage] = useState<HTMLImageElement | null>(null);

    // Pre-load accessory image when it changes
    useEffect(() => {
        if (accessoryImage) {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Ensure CORS compatibility
            img.src = accessoryImage;
            img.onload = () => {
                setLoadedAccessoryImage(img);
            };
            img.onerror = (e) => {
                console.error("Failed to load accessory image", e);
                setLoadedAccessoryImage(null);
            };
        } else {
            setLoadedAccessoryImage(null);
        }
    }, [accessoryImage]);

    useEffect(() => {
        if (!canvasRef.current || !videoElement || !landmarks) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Match canvas size to video
        if (canvas.width !== videoElement.videoWidth || canvas.height !== videoElement.videoHeight) {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
        }

        // Clear and apply makeup
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mirror the canvas to match the video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        applyMakeup(ctx, landmarks, {
            ...makeupSettings,
            accessory: {
                image: loadedAccessoryImage,
                opacity: 0.9,
                category: accessoryCategory
            }
        });

        ctx.restore();
    }, [videoElement, landmarks, makeupSettings, accessoryCategory]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
                mixBlendMode: 'normal',
            }}
        />
    );
}
