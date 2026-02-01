'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BackgroundMusic() {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    // Pages where music should play
    const shouldPlayMusic = pathname === '/makeup' || pathname === '/accessories';

    useEffect(() => {
        // Initialize audio
        if (!audioRef.current) {
            audioRef.current = new Audio('/background-music.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4; // Set a reasonable default volume
        }

        const audio = audioRef.current;

        // Handle playback based on route and mute status
        if (shouldPlayMusic && !isMuted) {
            // Attempt to play
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.log('Autoplay prevented or failed:', error);
                        setIsPlaying(false);
                    });
            }
        } else {
            audio.pause();
            setIsPlaying(false);
        }

        return () => {
            // Optional: pause on unmount if we want complete cleanup
            // But since this is likely in layout, it stays mounted
        };
    }, [pathname, isMuted, shouldPlayMusic]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Only show controls if we are on a music-enabled page
    if (!shouldPlayMusic) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full glass-strong flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 group border border-white/10"
                title={isMuted ? "Unmute Music" : "Mute Music"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                        {isPlaying && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        )}
                    </div>
                )}
            </button>
        </div>
    );
}
