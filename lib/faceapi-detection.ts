// Face-API.js integration for facial landmark detection

import * as faceapi from 'face-api.js';

export interface FacialLandmarks {
    lips: { x: number; y: number }[];
    leftCheek: { x: number; y: number }[];
    rightCheek: { x: number; y: number }[];
    leftEye: { x: number; y: number }[];
    rightEye: { x: number; y: number }[];
    allLandmarks: { x: number; y: number }[];
}

let modelsLoaded = false;
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

/**
 * Load face-api models
 */
export async function loadFaceApiModels(): Promise<void> {
    if (modelsLoaded) return;

    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        modelsLoaded = true;
        console.log('Face-API models loaded successfully');
    } catch (error) {
        console.error('Failed to load face-api models:', error);
        throw error;
    }
}

/**
 * Detect faces in an image element
 */
export async function detectFaceInImage(
    imageElement: HTMLImageElement
): Promise<FacialLandmarks | null> {
    if (!modelsLoaded) {
        await loadFaceApiModels();
    }

    try {
        const detection = await faceapi
            .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        if (!detection) {
            return null;
        }

        const landmarks = detection.landmarks.positions;
        
        return {
            lips: extractLips(landmarks),
            leftCheek: extractLeftCheek(landmarks),
            rightCheek: extractRightCheek(landmarks),
            leftEye: extractLeftEye(landmarks),
            rightEye: extractRightEye(landmarks),
            allLandmarks: landmarks.map((p: any) => ({ x: p.x, y: p.y })),
        };
    } catch (error) {
        console.error('Error detecting face:', error);
        return null;
    }
}

/**
 * Detect faces in a video stream (for webcam)
 */
export async function detectFaceInVideo(
    videoElement: HTMLVideoElement,
    onResults: (landmarks: FacialLandmarks | null) => void
): Promise<void> {
    if (!modelsLoaded) {
        await loadFaceApiModels();
    }

    try {
        const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        if (detection) {
            const landmarks = detection.landmarks.positions;
            
            const facialLandmarks: FacialLandmarks = {
                lips: extractLips(landmarks),
                leftCheek: extractLeftCheek(landmarks),
                rightCheek: extractRightCheek(landmarks),
                leftEye: extractLeftEye(landmarks),
                rightEye: extractRightEye(landmarks),
                allLandmarks: landmarks.map((p: any) => ({ x: p.x, y: p.y })),
            };
            
            onResults(facialLandmarks);
        } else {
            onResults(null);
        }
    } catch (error) {
        console.error('Error detecting face in video:', error);
        onResults(null);
    }
}

// Landmark extraction helpers (face-api uses 68-point landmark model)

function extractLips(landmarks: any[]): { x: number; y: number }[] {
    // Points 48-67 are mouth/lips
    return landmarks.slice(48, 68).map((p: any) => ({ x: p.x, y: p.y }));
}

function extractLeftCheek(landmarks: any[]): { x: number; y: number }[] {
    // Subject's left cheek (viewer's right side)
    // Points 17-21 (jaw/cheekbone outline) + 42-45 (lower left eye edge)
    // These form a tighter region around the actual cheek
    const cheekPoints = [17, 18, 19, 20, 21, 42, 43, 44, 45];
    return cheekPoints.map((i: number) => ({ x: landmarks[i].x, y: landmarks[i].y }));
}

function extractRightCheek(landmarks: any[]): { x: number; y: number }[] {
    // Subject's right cheek (viewer's left side)
    // Points 1-5 (jaw/cheekbone outline) + 36-39 (lower right eye edge)
    const cheekPoints = [1, 2, 3, 4, 5, 36, 37, 38, 39];
    return cheekPoints.map((i: number) => ({ x: landmarks[i].x, y: landmarks[i].y }));
}

function extractLeftEye(landmarks: any[]): { x: number; y: number }[] {
    // Points 36-41 are left eye
    return landmarks.slice(36, 42).map((p: any) => ({ x: p.x, y: p.y }));
}

function extractRightEye(landmarks: any[]): { x: number; y: number }[] {
    // Points 42-47 are right eye
    return landmarks.slice(42, 48).map((p: any) => ({ x: p.x, y: p.y }));
}
