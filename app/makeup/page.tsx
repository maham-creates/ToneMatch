'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import WebcamCapture from '@/components/WebcamCapture';
import VideoMakeupCanvas from '@/components/VideoMakeupCanvas';
import ControlPanel from '@/components/ControlPanel';
import ProductRecommendationsComponent from '@/components/ProductRecommendations';
import { initializeFaceMeshVideo, processVideoFrame, FacialLandmarks } from '@/lib/mediapipe-video';
import { detectSkinTone, getCombinedCheekRegion, SkinToneResult } from '@/lib/skinTone';
import { getRecommendedProducts, ProductRecommendations, Product } from '@/lib/productMatcher';
import { MakeupSettings } from '@/lib/makeupRenderer';

export default function MakeupPage() {
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [landmarks, setLandmarks] = useState<FacialLandmarks | null>(null);
    const [skinTone, setSkinTone] = useState<SkinToneResult | null>(null);
    const [recommendations, setRecommendations] = useState<ProductRecommendations | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const skinToneDetectedRef = useRef(false);

    const [makeupSettings, setMakeupSettings] = useState<MakeupSettings>({
        lipstick: { enabled: false, color: '#D4869C', opacity: 0 },
        blush: { enabled: false, color: '#F5A9B8', opacity: 0 },
        eyeshadow: { enabled: false, color: '#CD7F32', opacity: 0 },
    });

    // Initialize MediaPipe when webcam starts
    useEffect(() => {
        if (isWebcamActive) {
            initializeFaceMeshVideo((detectedLandmarks) => {
                setLandmarks(detectedLandmarks);

                if (detectedLandmarks && !skinToneDetectedRef.current && videoRef.current) {
                    const canvas = document.createElement('canvas');
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        ctx.drawImage(videoRef.current, 0, 0);
                        const cheekRegion = getCombinedCheekRegion(
                            detectedLandmarks.leftCheek,
                            detectedLandmarks.rightCheek
                        );
                        const detectedSkinTone = detectSkinTone(canvas, cheekRegion);
                        setSkinTone(detectedSkinTone);

                        const productRecs = getRecommendedProducts(
                            detectedSkinTone.depth,
                            detectedSkinTone.undertone
                        );
                        setRecommendations(productRecs);
                        skinToneDetectedRef.current = true;
                    }
                }
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

    const handleProductClick = (
        product: Product,
        category: 'lipstick' | 'blush' | 'eyeshadow'
    ) => {
        const defaultOpacities = {
            lipstick: 0.7,
            blush: 0.5,
            eyeshadow: 0.6
        };

        setMakeupSettings({
            ...makeupSettings,
            [category]: {
                enabled: true,
                color: product.color,
                opacity: defaultOpacities[category],
            },
        });
    };

    const handleStartWebcam = () => {
        setIsWebcamActive(true);
        setError(null);
        skinToneDetectedRef.current = false;
    };

    const handleStopWebcam = () => {
        setIsWebcamActive(false);
        setLandmarks(null);
        setSkinTone(null);
        setRecommendations(null);
        videoRef.current = null;
        skinToneDetectedRef.current = false;
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
                        <h1 className="text-4xl font-bold gradient-text">Try On Makeup</h1>
                        <p className="text-gray-400">Virtual Beauty Studio</p>
                    </div>
                </header>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
                        <p className="text-red-200 text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Webcam & Canvas */}
                    <div className="lg:col-span-6 space-y-6">
                        {!isWebcamActive ? (
                            <div className="glass-strong p-12 text-center">
                                <div className="flex flex-col items-center gap-6">
                                    <svg
                                        className="w-20 h-20 text-purple-400"
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
                                            Start Your Camera
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Allow camera access to try on makeup in real-time
                                        </p>
                                        <button
                                            onClick={handleStartWebcam}
                                            className="btn-primary text-lg px-8 py-4"
                                        >
                                            Start Camera
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <WebcamCapture onFrame={handleFrame} isActive={isWebcamActive} />
                                    <VideoMakeupCanvas
                                        videoElement={videoRef.current}
                                        landmarks={landmarks}
                                        makeupSettings={makeupSettings}
                                    />
                                    {!landmarks && (
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-lg">
                                            <p className="text-sm text-yellow-300">Looking for face...</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleStopWebcam}
                                    className="w-full glass hover:bg-white/10 py-3 rounded-lg transition-all"
                                >
                                    Stop Camera
                                </button>
                            </>
                        )}
                    </div>

                    {/* Middle Column - Controls */}
                    <div className="lg:col-span-3">
                        <ControlPanel
                            makeupSettings={makeupSettings}
                            onSettingsChange={setMakeupSettings}
                        />
                    </div>

                    {/* Right Column - Recommendations */}
                    <div className="lg:col-span-3">
                        <ProductRecommendationsComponent
                            skinTone={skinTone}
                            recommendations={recommendations}
                            onProductClick={handleProductClick}
                            isDetecting={!!landmarks}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
