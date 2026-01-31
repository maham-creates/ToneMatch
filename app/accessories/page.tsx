'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import WebcamCapture from '@/components/WebcamCapture';
import VideoMakeupCanvas from '@/components/VideoMakeupCanvas';
import { initializeFaceMeshVideo, processVideoFrame, FacialLandmarks } from '@/lib/mediapipe-video';

export default function AccessoriesPage() {
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [landmarks, setLandmarks] = useState<FacialLandmarks | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Initialize MediaPipe when webcam starts
    useEffect(() => {
        if (isWebcamActive) {
            initializeFaceMeshVideo((detectedLandmarks) => {
                setLandmarks(detectedLandmarks);
            }).catch((error) => {
                console.error('Failed to initialize MediaPipe:', error);
                setError('Failed to initialize face detection');
            });
        }
    }, [isWebcamActive]);

    const handleFrame = useCallback((video: HTMLVideoElement) => {
        videoRef.current = video;
        processVideoFrame(video);
    }, []);

    const handleStartWebcam = () => {
        setIsWebcamActive(true);
        setError(null);
    };

    const handleStopWebcam = () => {
        setIsWebcamActive(false);
        setLandmarks(null);
        videoRef.current = null;
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-12 animate-fade-in">
                    <Link href="/" className="glass px-4 py-2 hover:bg-white/10 transition-all text-sm">
                        ← Back to Home
                    </Link>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold gradient-text">Try On Accessories</h1>
                        <p className="text-gray-400">Jewelry, Glasses & More</p>
                    </div>
                </header>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
                        <p className="text-red-200 text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {!isWebcamActive ? (
                        <div className="glass-strong p-12 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <svg
                                    className="w-20 h-20 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>

                                <div>
                                    <h3 className="text-2xl font-semibold mb-3">
                                        Accessory Virtual Mirror
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Face detection is active. Accessories coming soon!
                                    </p>
                                    <button
                                        onClick={handleStartWebcam}
                                        className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 text-lg px-8 py-4"
                                    >
                                        Start Mirror
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="relative aspect-video max-w-3xl mx-auto overflow-hidden rounded-2xl glass-strong">
                                <WebcamCapture onFrame={handleFrame} isActive={isWebcamActive} />
                                <VideoMakeupCanvas
                                    videoElement={videoRef.current}
                                    landmarks={landmarks}
                                    makeupSettings={{
                                        lipstick: { enabled: false, color: '', opacity: 0 },
                                        blush: { enabled: false, color: '', opacity: 0 },
                                        eyeshadow: { enabled: false, color: '', opacity: 0 },
                                    }}
                                />
                                {!landmarks && (
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-lg">
                                        <p className="text-sm text-yellow-300">Looking for face...</p>
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-xl border-blue-500/30">
                                    <p className="text-blue-300 font-medium">✨ Accessories feature in development</p>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleStopWebcam}
                                    className="glass hover:bg-white/10 px-8 py-3 rounded-lg transition-all"
                                >
                                    Stop Mirror
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
