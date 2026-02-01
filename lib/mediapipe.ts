// MediaPipe Face Mesh integration for static image processing
// Uses dynamic imports to avoid SSR issues

export interface FacialLandmarks {
    lips: { x: number; y: number }[];
    leftCheek: { x: number; y: number }[];
    rightCheek: { x: number; y: number }[];
    leftEye: { x: number; y: number }[];
    rightEye: { x: number; y: number }[];
    leftEyeshadow: { x: number; y: number }[];
    rightEyeshadow: { x: number; y: number }[];
    allLandmarks: { x: number; y: number }[];
}

// Landmark indices for different facial regions
const LIPS_INDICES = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
    185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78
];

const LEFT_CHEEK_INDICES = [116, 123, 147, 213, 192, 214, 212, 202, 203];
const RIGHT_CHEEK_INDICES = [345, 352, 376, 433, 416, 434, 432, 422, 423];

const LEFT_EYE_INDICES = [
    33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246
];
const RIGHT_EYE_INDICES = [
    362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398
];

const LEFT_EYESHADOW_INDICES = [
    33, 161, 160, 159, 158, 157, 173, 133, 243, 190, 56, 28, 27, 29, 30, 247, 130
];

const RIGHT_EYESHADOW_INDICES = [
    362, 398, 384, 385, 386, 387, 388, 466, 263, 463, 414, 286, 258, 257, 259, 260, 467, 359
];

let faceMeshInstance: any = null;

/**
 * Initialize MediaPipe Face Mesh with dynamic import
 */
export async function initializeFaceMesh(): Promise<any> {
    // Dynamic import to avoid SSR issues
    const { FaceMesh } = await import('@mediapipe/face_mesh');

    return new Promise((resolve, reject) => {
        try {
            const faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                },
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMeshInstance = faceMesh;
            resolve(faceMesh);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Process an image and extract facial landmarks
 */
export async function processFaceImage(
    imageElement: HTMLImageElement
): Promise<FacialLandmarks | null> {
    if (!faceMeshInstance) {
        faceMeshInstance = await initializeFaceMesh();
    }

    return new Promise((resolve, reject) => {
        faceMeshInstance!.onResults((results: any) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];

                // Convert normalized coordinates to pixel coordinates
                const width = imageElement.width;
                const height = imageElement.height;

                const convertLandmarks = (indices: number[]) => {
                    return indices.map((index) => ({
                        x: landmarks[index].x * width,
                        y: landmarks[index].y * height,
                    }));
                };

                const facialLandmarks: FacialLandmarks = {
                    lips: convertLandmarks(LIPS_INDICES),
                    leftCheek: convertLandmarks(LEFT_CHEEK_INDICES),
                    rightCheek: convertLandmarks(RIGHT_CHEEK_INDICES),
                    leftEye: convertLandmarks(LEFT_EYE_INDICES),
                    rightEye: convertLandmarks(RIGHT_EYE_INDICES),
                    leftEyeshadow: convertLandmarks(LEFT_EYESHADOW_INDICES),
                    rightEyeshadow: convertLandmarks(RIGHT_EYESHADOW_INDICES),
                    allLandmarks: landmarks.map((lm: any) => ({
                        x: lm.x * width,
                        y: lm.y * height,
                    })),
                };

                resolve(facialLandmarks);
            } else {
                resolve(null);
            }
        });

        // Send the image to MediaPipe
        faceMeshInstance!.send({ image: imageElement }).catch(reject);
    });
}

/**
 * Clean up MediaPipe instance
 */
export function cleanupFaceMesh() {
    if (faceMeshInstance) {
        faceMeshInstance.close();
        faceMeshInstance = null;
    }
}
