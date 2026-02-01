// MediaPipe Face Mesh integration for real-time video processing using CDN

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
let isProcessing = false;
let scriptsLoaded = false;

// Temporal smoothing state
let previousLandmarks: FacialLandmarks | null = null;
const SMOOTHING_FACTOR = 0.45; // Lower = smoother but more lag, Higher = more responsive but more jitter

/**
 * Load MediaPipe scripts from CDN
 */
async function loadMediaPipeScripts(): Promise<void> {
    if (scriptsLoaded) return;

    return new Promise((resolve, reject) => {
        // Load the main MediaPipe script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
        script.crossOrigin = 'anonymous';

        script.onload = () => {
            console.log('MediaPipe script loaded from CDN');
            scriptsLoaded = true;
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load MediaPipe script from CDN'));
        };

        document.head.appendChild(script);
    });
}

/**
 * Apply temporal smoothing to landmarks
 */
function smoothLandmarks(current: FacialLandmarks, previous: FacialLandmarks | null): FacialLandmarks {
    if (!previous) return current;

    const smoothPoint = (curr: { x: number; y: number }, prev: { x: number; y: number }) => ({
        x: prev.x + SMOOTHING_FACTOR * (curr.x - prev.x),
        y: prev.y + SMOOTHING_FACTOR * (curr.y - prev.y),
    });

    const smoothPoints = (currArr: { x: number; y: number }[], prevArr: { x: number; y: number }[]) => {
        return currArr.map((p, i) => smoothPoint(p, prevArr[i] || p));
    };

    return {
        lips: smoothPoints(current.lips, previous.lips),
        leftCheek: smoothPoints(current.leftCheek, previous.leftCheek),
        rightCheek: smoothPoints(current.rightCheek, previous.rightCheek),
        leftEye: smoothPoints(current.leftEye, previous.leftEye),
        rightEye: smoothPoints(current.rightEye, previous.rightEye),
        leftEyeshadow: smoothPoints(current.leftEyeshadow, previous.leftEyeshadow),
        rightEyeshadow: smoothPoints(current.rightEyeshadow, previous.rightEyeshadow),
        allLandmarks: smoothPoints(current.allLandmarks, previous.allLandmarks),
    };
}

/**
 * Initialize MediaPipe Face Mesh for video
 */
export async function initializeFaceMeshVideo(
    onResults: (landmarks: FacialLandmarks | null) => void
): Promise<any> {
    if (faceMeshInstance) {
        return faceMeshInstance;
    }

    try {
        // Load MediaPipe scripts from CDN
        await loadMediaPipeScripts();

        // Wait a bit for the global FaceMesh to be available
        await new Promise(resolve => setTimeout(resolve, 500));

        // Access FaceMesh from global window object
        const FaceMesh = (window as any).FaceMesh;

        if (!FaceMesh) {
            throw new Error('FaceMesh not found on window object after loading CDN script');
        }

        console.log('Creating FaceMesh instance from CDN...');

        // Create FaceMesh instance
        const faceMesh = new FaceMesh({
            locateFile: (file: string) => {
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
            console.log('MediaPipe onResults called', { hasLandmarks: !!results.multiFaceLandmarks?.length });

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

                const rawLandmarks: FacialLandmarks = {
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

                const smoothedLandmarks = smoothLandmarks(rawLandmarks, previousLandmarks);
                previousLandmarks = smoothedLandmarks;

                onResults(smoothedLandmarks);
            } else {
                previousLandmarks = null;
                onResults(null);
            }
            isProcessing = false;
        });

        console.log('MediaPipe FaceMesh initialized successfully via CDN');
        faceMeshInstance = faceMesh;
        return faceMesh;
    } catch (error) {
        console.error('Error initializing MediaPipe:', error);
        throw error;
    }
}

/**
 * Process a video frame
 */
export async function processVideoFrame(video: HTMLVideoElement): Promise<void> {
    if (!faceMeshInstance) {
        return;
    }

    if (isProcessing) {
        return;
    }

    isProcessing = true;
    try {
        await faceMeshInstance.send({ image: video });
    } catch (error) {
        console.error('Error processing frame:', error);
        isProcessing = false;
    }
    // Note: isProcessing is reset to false in the onResults callback
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
