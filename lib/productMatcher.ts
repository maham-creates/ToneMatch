// Product matching logic based on skin tone

import productsData from '@/data/products.json';

export interface Product {
    id: string;
    brand: string;
    name: string;
    shade: string;
    color: string;
    price?: number;
    url?: string;
    retailer?: string;
    depth?: 'light' | 'medium' | 'deep';
    undertone?: 'warm' | 'neutral' | 'cool';
}

export interface ProductRecommendations {
    lipsticks: Product[];
    blushes: Product[];
    eyeshadows: Product[];
}

/**
 * Filter products by skin tone
 */
export function getRecommendedProducts(
    depth: 'light' | 'medium' | 'deep',
    undertone: 'warm' | 'neutral' | 'cool'
): ProductRecommendations {
    const filterProducts = (products: Product[]) => {
        // If products don't have depth/undertone, return them all (universal)
        return products.filter((product) => {
            if (!product.depth || !product.undertone) return true;

            // Exact match on depth
            const depthMatch = product.depth === depth;

            // Undertone matching: neutral matches everything, otherwise exact match
            const undertoneMatch =
                product.undertone === undertone ||
                product.undertone === 'neutral' ||
                undertone === 'neutral';

            return depthMatch && undertoneMatch;
        });
    };

    return {
        lipsticks: filterProducts(productsData.lipsticks as Product[]),
        blushes: filterProducts(productsData.blushes as Product[]),
        eyeshadows: filterProducts(productsData.eyeshadows as Product[]),
    };
}

/**
 * Get all products (for browsing)
 */
export function getAllProducts(): ProductRecommendations {
    return {
        lipsticks: productsData.lipsticks as Product[],
        blushes: productsData.blushes as Product[],
        eyeshadows: productsData.eyeshadows as Product[],
    };
}

/**
 * Find a product by ID
 */
export function getProductById(id: string): Product | null {
    const allProducts = [
        ...productsData.lipsticks,
        ...productsData.blushes,
        ...productsData.eyeshadows,
    ] as Product[];

    return allProducts.find((p) => p.id === id) || null;
}
