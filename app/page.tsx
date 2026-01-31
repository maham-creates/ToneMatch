'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen p-8 flex items-center justify-center bg-[#0a0a0a]">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <header className="text-center mb-16 animate-fade-in">
                    <h1 className="text-7xl font-bold gradient-text mb-6">ToneMatch</h1>
                    <p className="text-gray-400/80 italic font-serif text-lg mb-8 max-w-2xl mx-auto">
                        Disclaimer: You are already beautiful enough, we're just here to help you shine.
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </header>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {/* Makeup Card */}
                    <Link href="/makeup" className="group relative block h-full">
                        <div className="glass-strong p-8 h-full border border-white/5 group-hover:border-purple-500/30 transition-all duration-500 flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-3 group-hover:text-purple-400 transition-colors">Makeup Try-On</h2>
                                <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                                    Virtually try on lipsticks, blushes, and eyeshadows tailored to your unique skin tone.
                                </p>
                                <span className="btn-primary w-full text-center mt-auto">Try On Makeup</span>
                            </div>
                        </div>
                    </Link>

                    {/* Accessories Card */}
                    <Link href="/accessories" className="group relative block h-full">
                        <div className="glass-strong p-8 h-full border border-white/5 group-hover:border-blue-500/30 transition-all duration-500 flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Accessories</h2>
                                <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                                    Try on virtual jewelry and accessories with real-time facial tracking technology.
                                </p>
                                <span className="btn-primary w-full text-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/20 mt-auto">Try On Accessories</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer Quote */}
                <footer className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-gray-600 text-sm">
                        Experience the future of personalized beauty with ToneMatch.
                    </p>
                </footer>
            </div>
        </main>
    );
}
