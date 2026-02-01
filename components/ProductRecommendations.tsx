'use client';

import { SkinToneResult } from '@/lib/skinTone';
import { Product, ProductRecommendations } from '@/lib/productMatcher';
import { memo, useState, useEffect, useCallback } from 'react';

interface ProductCardProps {
    product: Product;
    category: 'lipstick' | 'blush' | 'eyeshadow';
    onClick: (product: Product, category: 'lipstick' | 'blush' | 'eyeshadow') => void;
}

const ProductCard = memo(({
    product,
    category,
    onClick,
}: ProductCardProps) => (
    <button
        onClick={() => onClick(product, category)}
        className="glass p-4 text-left hover:bg-white/10 transition-all group w-full"
    >
        <div className="flex items-center gap-3">
            <div
                className="w-12 h-12 rounded-lg border-2 border-white/20 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: product.color }}
            ></div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.brand}</p>
                <p className="text-xs text-gray-400 truncate">{product.name}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-purple-300 truncate">{product.shade}</p>
                    <code className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{product.color.toUpperCase()}</code>
                </div>
            </div>
        </div>
    </button>
));

ProductCard.displayName = 'ProductCard';

interface ProductRecommendationsProps {
    skinTone: SkinToneResult | null;
    recommendations: ProductRecommendations | null;
    onProductClick: (product: Product, category: 'lipstick' | 'blush' | 'eyeshadow') => void;
    isDetecting?: boolean;
}

const ProductRecommendationsComponent = memo(({
    skinTone,
    recommendations,
    onProductClick,
    isDetecting = false,
}: ProductRecommendationsProps) => {
    const [offsets, setOffsets] = useState({
        lipstick: 0,
        blush: 0,
        eyeshadow: 0,
    });

    const PRODUCTS_PER_PAGE = 2;

    const getDisplayedProducts = useCallback((products: Product[], category: 'lipstick' | 'blush' | 'eyeshadow') => {
        if (products.length <= PRODUCTS_PER_PAGE) return products;
        const offset = offsets[category];
        const displayed = [];
        for (let i = 0; i < PRODUCTS_PER_PAGE; i++) {
            displayed.push(products[(offset + i) % products.length]);
        }
        return displayed;
    }, [offsets]);

    const handleRefresh = (category: 'lipstick' | 'blush' | 'eyeshadow') => {
        setOffsets(prev => ({
            ...prev,
            [category]: (prev[category] + PRODUCTS_PER_PAGE) % (recommendations?.[category === 'lipstick' ? 'lipsticks' : category === 'blush' ? 'blushes' : 'eyeshadows'].length || 1)
        }));
    };

    // Reset offsets when skin tone changes (new detection)
    useEffect(() => {
        setOffsets({ lipstick: 0, blush: 0, eyeshadow: 0 });
    }, [skinTone]);

    if (!skinTone || !recommendations) {
        return (
            <div className="glass-strong p-6">
                <h2 className="text-2xl font-bold gradient-text mb-4">AI generated Skin Tone Recommendations</h2>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-20 bg-white/5 rounded w-full"></div>
                    <div className="h-20 bg-white/5 rounded w-full"></div>
                </div>
            </div>
        );
    }

    const lipsticks = getDisplayedProducts(recommendations.lipsticks, 'lipstick');
    const blushes = getDisplayedProducts(recommendations.blushes, 'blush');
    const eyeshadows = getDisplayedProducts(recommendations.eyeshadows, 'eyeshadow');

    return (
        <div className={`glass-strong p-6 space-y-6 max-h-[800px] overflow-y-auto ${skinTone ? 'animate-slide-in-right' : ''}`}>
            <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Your Skin Tone</h2>

                <div className={`glass p-4 space-y-2 ${isDetecting ? 'pulse-glow' : ''}`}>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Depth:</span>
                        <span className="font-semibold capitalize text-purple-300">{skinTone.depth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Undertone:</span>
                        <span className="font-semibold capitalize text-purple-300">{skinTone.undertone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="font-semibold capitalize text-purple-300">{skinTone.confidence}</span>
                    </div>
                </div>

                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-200">
                        ⚠️ {skinTone.disclaimer}
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Lipstick Recommendations */}
            <div>
                <div className="flex justify-between items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 shrink-0">
                        <span className="text-pink-400">💄</span> Lipsticks
                    </h3>
                    {recommendations.lipsticks.length > PRODUCTS_PER_PAGE && (
                        <button
                            onClick={() => handleRefresh('lipstick')}
                            className="text-[10px] uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                        >
                            <span>try more!</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {lipsticks.length > 0 ? (
                        lipsticks.map((product) => (
                            <ProductCard key={`${product.id}-${offsets.lipstick}`} product={product} category="lipstick" onClick={onProductClick} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>

            {/* Blush Recommendations */}
            <div>
                <div className="flex justify-between items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 shrink-0">
                        <span className="text-rose-400">✨</span> Blushes
                    </h3>
                    {recommendations.blushes.length > PRODUCTS_PER_PAGE && (
                        <button
                            onClick={() => handleRefresh('blush')}
                            className="text-[10px] uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                        >
                            <span>try more!</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {blushes.length > 0 ? (
                        blushes.map((product) => (
                            <ProductCard key={`${product.id}-${offsets.blush}`} product={product} category="blush" onClick={onProductClick} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>

            {/* Eyeshadow Recommendations */}
            <div>
                <div className="flex justify-between items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 shrink-0">
                        <span className="text-purple-400">👁️</span> Eyeshadows
                    </h3>
                    {recommendations.eyeshadows.length > PRODUCTS_PER_PAGE && (
                        <button
                            onClick={() => handleRefresh('eyeshadow')}
                            className="text-[10px] uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                        >
                            <span>try more!</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {eyeshadows.length > 0 ? (
                        eyeshadows.map((product) => (
                            <ProductCard key={`${product.id}-${offsets.eyeshadow}`} product={product} category="eyeshadow" onClick={onProductClick} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>
        </div>
    );
});
ProductRecommendationsComponent.displayName = 'ProductRecommendationsComponent';

export default ProductRecommendationsComponent;
