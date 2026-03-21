import * as faceapi from '@vladmandic/face-api';

// Use JSDelivr CDN - bypasses local Vite SPA fallback bugs
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export const loadFaceModels = async () => {
    if (!faceapi.nets.tinyFaceDetector.isLoaded) {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            console.log("Real AI Face Models loaded via CDN.");
        } catch (error) {
            console.error("Failed to load Face Models:", error);
            throw new Error("Facial Recognition Models failed to load. Check your network. " + error.message);
        }
    }
};

// Extracts a 128-d float array biometric signature from an image or video HTML element
export const getFaceDescriptor = async (mediaElement) => {
    await loadFaceModels();
    
    // Using TinyFaceDetector which is fast and lightweight for web
    const detection = await faceapi.detectSingleFace(
        mediaElement, 
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
    ).withFaceLandmarks().withFaceDescriptor();

    // detection contains .descriptor (Float32Array) and .landmarks
    return detection || null;
};

// Converts standard JS array/object DB descriptors back to Float32Array for face-api
export const parseDescriptor = (dbDescriptor) => {
    if (!dbDescriptor) return null;
    return new Float32Array(Object.values(dbDescriptor));
};

export const getFaceDescriptorFromBase64 = async (base64) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("AI FACE DETECTION TIMEOUT: Image processing took too long. Check lighting."));
        }, 15000);

        const img = new Image();
        img.onload = async () => {
            try {
                const detection = await getFaceDescriptor(img);
                clearTimeout(timeout);
                resolve(detection ? detection.descriptor : null);
            } catch (err) {
                clearTimeout(timeout);
                console.error("getFaceDescriptor error:", err);
                reject(err);
            }
        };
        img.onerror = (err) => {
            clearTimeout(timeout);
            console.error("Image loading error:", err);
            reject(new Error("Failed to load image from base64"));
        };
        img.src = base64;
    });
};

export const compareFaces = (descriptor1, descriptor2) => {
    if (!descriptor1 || !descriptor2) return null;
    return faceapi.euclideanDistance(descriptor1, descriptor2);
};
