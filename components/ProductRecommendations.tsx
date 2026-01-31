'use client';

import { SkinToneResult } from '@/lib/skinTone';
import { Product, ProductRecommendations } from '@/lib/productMatcher';
import { MakeupSettings } from '@/lib/makeupRenderer';

interface ProductRecommendationsProps {
    skinTone: SkinToneResult | null;
    recommendations: ProductRecommendations | null;
    onProductClick: (product: Product, category: 'lipstick' | 'blush' | 'eyeshadow') => void;
}

export default function ProductRecommendationsComponent({
    skinTone,
    recommendations,
    onProductClick,
}: ProductRecommendationsProps) {
    if (!skinTone || !recommendations) {
        return (
            <div className="glass-strong p-6">
                <h2 className="text-2xl font-bold gradient-text mb-4">Product Recommendations</h2>
                <p className="text-gray-400 text-sm">
                    Upload a photo to get personalized product recommendations
                </p>
            </div>
        );
    }

    const ProductCard = ({
        product,
        category,
    }: {
        product: Product;
        category: 'lipstick' | 'blush' | 'eyeshadow';
    }) => (
        <button
            onClick={() => onProductClick(product, category)}
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
                    <p className="text-xs text-purple-300 truncate">{product.shade}</p>
                </div>
            </div>
        </button>
    );

    return (
        <div className="glass-strong p-6 space-y-6 max-h-[800px] overflow-y-auto">
            <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Your Skin Tone</h2>

                <div className="glass p-4 space-y-2">
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
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-pink-400">💄</span> Lipsticks
                </h3>
                <div className="space-y-2">
                    {recommendations.lipsticks.length > 0 ? (
                        recommendations.lipsticks.map((product) => (
                            <ProductCard key={product.id} product={product} category="lipstick" />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>

            {/* Blush Recommendations */}
            <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-rose-400">✨</span> Blushes
                </h3>
                <div className="space-y-2">
                    {recommendations.blushes.length > 0 ? (
                        recommendations.blushes.map((product) => (
                            <ProductCard key={product.id} product={product} category="blush" />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>

            {/* Eyeshadow Recommendations */}
            <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-purple-400">👁️</span> Eyeshadows
                </h3>
                <div className="space-y-2">
                    {recommendations.eyeshadows.length > 0 ? (
                        recommendations.eyeshadows.map((product) => (
                            <ProductCard key={product.id} product={product} category="eyeshadow" />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matches found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
