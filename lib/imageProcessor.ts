import { removeBackground } from '@imgly/background-removal';

/**
 * Converts any image source to a PNG Base64 string.
 * @param imageSource The source image (Base64 string or URL)
 * @returns A promise that resolves to a PNG Base64 string
 */
export async function convertToPNG(imageSource: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load image for PNG conversion'));
        img.src = imageSource;
    });
}

/**
 * Removes the background from an image using AI extraction.
 * @param imageSource The source image (Base64 string or URL)
 * @returns A promise that resolves to a Base64 string of the processed image
 */
export async function removeImageBackground(imageSource: string): Promise<string> {
    try {
        console.log('Starting background removal...');

        // Configuration for the extraction algorithm
        const config = {
            progress: (status: string, progress: number) => {
                console.log(`Background removal progress: ${status} (${Math.round(progress * 100)}%)`);
            }
        };

        const processedBlob = await removeBackground(imageSource, config);

        // Convert Blob to Base64 (PNG by default from the library)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(processedBlob);
        });
    } catch (error) {
        console.error('Background removal failed:', error);
        // Fallback to PNG conversion if AI fails or is interrupted
        console.log('Falling back to standard PNG conversion...');
        return convertToPNG(imageSource);
    }
}
