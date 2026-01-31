// MediaPipe Face Mesh integration for real-time video processing

export interface FacialLandmarks {
    lips: { x: number; y: number }[];
    leftCheek: { x: number; y: number }[];
    rightCheek: { x: number; y: number }[];
    leftEye: { x: number; y: number }[];
    rightEye: { x: number; y: number }[];
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

let faceMeshInstance: any = null;
let isProcessing = false;

/**
 * Initialize MediaPipe Face Mesh for video
 */
export async function initializeFaceMeshVideo(
    onResults: (landmarks: FacialLandmarks | null) => void
): Promise<any> {
    if (faceMeshInstance) {
        return faceMeshInstance;
    }

    // Dynamic import to avoid SSR issues
    const { FaceMesh } = await import('@mediapipe/face_mesh');

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

    faceMesh.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const width = results.image.width;
            const height = results.image.height;

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
                allLandmarks: landmarks.map((lm: any) => ({
                    x: lm.x * width,
                    y: lm.y * height,
                })),
            };

            onResults(facialLandmarks);
        } else {
            onResults(null);
        }
        isProcessing = false;
    });

    faceMeshInstance = faceMesh;
    return faceMesh;
}

/**
 * Process a video frame
 */
export async function processVideoFrame(video: HTMLVideoElement): Promise<void> {
    if (!faceMeshInstance || isProcessing) {
        return;
    }

    isProcessing = true;
    try {
        await faceMeshInstance.send({ image: video });
    } catch (error) {
        console.error('Error processing frame:', error);
        isProcessing = false;
    }
}

/**
 * Clean up MediaPipe instance
 */
export function cleanupFaceMeshVideo() {
    if (faceMeshInstance) {
        faceMeshInstance.close();
        faceMeshInstance = null;
    }
    isProcessing = false;
}
