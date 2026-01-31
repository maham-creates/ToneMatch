'use client';

import { useRef, useEffect, useState } from 'react';

interface WebcamCaptureProps {
    onFrame: (video: HTMLVideoElement) => void;
    isActive: boolean;
}

export default function WebcamCapture({ onFrame, isActive }: WebcamCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let animationFrameId: number;

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user',
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        setIsLoading(false);

                        // Start processing frames
                        const processFrame = () => {
                            if (videoRef.current && isActive) {
                                onFrame(videoRef.current);
                            }
                            animationFrameId = requestAnimationFrame(processFrame);
                        };
                        processFrame();
                    };
                }
            } catch (err) {
                console.error('Error accessing webcam:', err);
                setError('Could not access webcam. Please grant camera permissions.');
                setIsLoading(false);
            }
        };

        if (isActive) {
            startWebcam();
        }

        return () => {
            // Cleanup
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isActive, onFrame]);

    if (error) {
        return (
            <div className="glass-strong p-8 text-center">
                <div className="text-red-400 mb-4">⚠️ {error}</div>
                <p className="text-gray-400 text-sm">
                    Please check your browser permissions and try again.
                </p>
            </div>
        );
    }

    return (
        <div className="glass p-4 relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-white">Starting camera...</p>
                    </div>
                </div>
            )}
            <video
                ref={videoRef}
                className="w-full h-auto rounded-lg mirror"
                autoPlay
                playsInline
                muted
            />
            <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    );
}
