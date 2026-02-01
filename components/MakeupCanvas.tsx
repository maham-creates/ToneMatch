'use client';

import { useEffect, useRef } from 'react';
import { applyMakeup, MakeupSettings } from '@/lib/makeupRenderer';
import { FacialLandmarks } from '@/lib/mediapipe';

interface MakeupCanvasProps {
    image: HTMLImageElement | null;
    landmarks: FacialLandmarks | null;
    makeupSettings: MakeupSettings;
}

export default function MakeupCanvas({ image, landmarks, makeupSettings }: MakeupCanvasProps) {
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const makeupCanvasRef = useRef<HTMLCanvasElement>(null);

    // Draw the base image
    useEffect(() => {
        if (!image || !imageCanvasRef.current) return;

        const canvas = imageCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        ctx.drawImage(image, 0, 0);
    }, [image]);

    // Apply makeup when settings or landmarks change
    useEffect(() => {
        if (!landmarks || !makeupCanvasRef.current || !imageCanvasRef.current) return;

        const canvas = makeupCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Match canvas size to image canvas
        canvas.width = imageCanvasRef.current.width;
        canvas.height = imageCanvasRef.current.height;

        // Apply makeup
        applyMakeup(ctx, landmarks, makeupSettings);
    }, [landmarks, makeupSettings]);

    if (!image) {
        return (
            <div className="glass flex items-center justify-center h-[600px]">
                <p className="text-gray-400">Upload a photo to get started</p>
            </div>
        );
    }

    return (
        <div className="glass p-4">
            <div className="relative inline-block max-w-full">
                {/* Base image canvas */}
                <canvas
                    ref={imageCanvasRef}
                    className="max-w-full h-auto rounded-lg"
                />

                {/* Makeup overlay canvas */}
                <canvas
                    ref={makeupCanvasRef}
                    className="absolute top-0 left-0 max-w-full h-auto rounded-lg pointer-events-none"
                    style={{
                        mixBlendMode: 'normal',
                    }}
                />
            </div>
        </div>
    );
}
