'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import WebcamCapture from '@/components/WebcamCapture';
import VideoMakeupCanvas from '@/components/VideoMakeupCanvas';
import { initializeFaceMeshVideo, processVideoFrame, FacialLandmarks } from '@/lib/mediapipe-video';
import { AccessoryCategory } from '@/lib/makeupRenderer';
import { removeImageBackground, convertToPNG } from '@/lib/imageProcessor';

export default function AccessoriesPage() {
    const [isWebcamActive, setIsWebcamActive] = useState(true);
    const [landmarks, setLandmarks] = useState<FacialLandmarks | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [accessoryCategory, setAccessoryCategory] = useState<AccessoryCategory>('glasses');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);
            setProcessingStatus('Preparing image...');
            setError(null);

            // Read file
            const reader = new FileReader();
            const imageData: string = await new Promise((resolve, reject) => {
                reader.onload = (event) => resolve(event.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Pause face detection temporarily if needed to free up resources for AI
            // In this version we rely on the single-threaded nature of JS to some extent, 
            // but the background removal happens in a worker/async. 
            // If performance is an issue, we could explicitly stop the loop here, 
            // but let's try just processing first.
            setProcessingStatus('Removing background...');

            // Process the image: Remove background and ensure PNG format
            const processedImage = await removeImageBackground(imageData);

            setUploadedImages((prev) => [processedImage, ...prev]);
            setAccessoryCategory('glasses'); // Default to glasses
            setProcessingStatus('');
        } catch (err: any) {
            console.error('Processing failed:', err);
            setError(`Failed to process image: ${err.message}. Please try again.`);
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
            // Reset input value to allow selecting the same file again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

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
                <div className="max-w-6xl mx-auto space-y-8">
                    {!isWebcamActive ? (
                        <div className="flex justify-center items-center">
                            {/* Center Mirror Box - Now centered and full width of max-container */}
                            <div className="w-full max-w-4xl glass-strong p-12 text-center flex flex-col items-center justify-center border border-white/5 transition-all">
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
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Left Controls/Info Box */}
                            <div className="glass-strong p-6 space-y-4 h-full">
                                <h3 className="text-lg font-bold gradient-text">Mirror Controls</h3>
                                <div className="space-y-4">
                                    <div className="p-4 glass rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Status</p>
                                        <p className="text-sm font-medium text-green-400 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            Camera Active
                                        </p>
                                    </div>
                                    <div className="p-4 glass rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Face Detection</p>
                                        <p className="text-sm font-medium text-blue-400">
                                            {landmarks ? '✨ Tracking active' : '🔍 Looking for face...'}
                                        </p>
                                    </div>

                                    {/* Accessory Placement */}
                                    <div className="space-y-3 p-4 glass rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Placement</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(['glasses', 'earrings', 'hat', 'generic'] as const).map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setAccessoryCategory(cat)}
                                                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all border ${accessoryCategory === cat
                                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {cat === 'generic' ? 'Center' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full glass-strong p-4 flex flex-col items-center justify-center text-center group border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all text-sm group"
                                    >
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        </div>
                                        <span className="text-blue-400 font-semibold text-xs">Upload Accessory</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleStopWebcam}
                                    className="w-full glass hover:bg-white/10 py-3 rounded-xl transition-all border border-white/10 text-sm mt-4"
                                >
                                    Stop Mirror
                                </button>
                            </div>

                            {/* Mirror Display (spans 3 columns) */}
                            <div className="lg:col-span-3 relative aspect-video overflow-hidden rounded-2xl glass-strong border border-white/10 shadow-2xl">
                                <WebcamCapture onFrame={handleFrame} isActive={isWebcamActive} />
                                <VideoMakeupCanvas
                                    videoElement={videoRef.current}
                                    landmarks={landmarks}
                                    makeupSettings={{
                                        lipstick: { enabled: false, color: '', opacity: 0 },
                                        blush: { enabled: false, color: '', opacity: 0 },
                                        eyeshadow: { enabled: false, color: '', opacity: 0 },
                                    }}
                                    accessoryImage={uploadedImages[0]}
                                    accessoryCategory={accessoryCategory}
                                />
                                {!landmarks && (
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-lg z-20">
                                        <p className="text-sm text-yellow-300">Looking for face...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Consolidated hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />

                </div>
            </div>
        </main>
    );
}
