'use client';

import { useEffect, useRef } from 'react';
import { applyMakeup, MakeupSettings } from '@/lib/makeupRenderer';
import { FacialLandmarks } from '@/lib/mediapipe-video';

interface VideoMakeupCanvasProps {
    videoElement: HTMLVideoElement | null;
    landmarks: FacialLandmarks | null;
    makeupSettings: MakeupSettings;
    accessoryImage?: string | null;
}

export default function VideoMakeupCanvas({
    videoElement,
    landmarks,
    makeupSettings,
    accessoryImage
}: VideoMakeupCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const accessoryImgRef = useRef<HTMLImageElement | null>(null);

    // Pre-load accessory image when it changes
    useEffect(() => {
        if (accessoryImage) {
            const img = new Image();
            img.src = accessoryImage;
            img.onload = () => {
                accessoryImgRef.current = img;
            };
        } else {
            accessoryImgRef.current = null;
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
                image: accessoryImgRef.current,
                opacity: 0.9
            }
        });

        ctx.restore();
    }, [videoElement, landmarks, makeupSettings]);

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
