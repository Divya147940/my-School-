import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
let modelsLoadingPromise = null;

export const loadFaceModels = async () => {
    if (faceapi.nets.tinyFaceDetector.isLoaded) {
        return modelsLoadingPromise || Promise.resolve();
    }
    
    if (!modelsLoadingPromise) {
        modelsLoadingPromise = (async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                console.log("Elite Face Models loaded via CDN.");
            } catch (error) {
                console.error("Failed to load Face Models:", error);
                modelsLoadingPromise = null; // allow retry
                throw new Error("Facial Recognition Models failed to load. Check your network. " + error.message);
            }
        })();
    }
    
    return modelsLoadingPromise;
};

// Extracts a 128-d float array biometric signature from an image or video HTML element
export const getFaceDescriptor = async (mediaElement) => {
    await loadFaceModels();
    
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 416,
        scoreThreshold: 0.1 
    });
    const detection = await faceapi.detectSingleFace(
        mediaElement, 
        detectionOptions
    ).withFaceLandmarks().withFaceDescriptor();

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
                // Return full detection object for cropping/analysis
                resolve(detection || null);
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

// DIRECT STREAM DETECTION: Zero-overhead real-time analysis
export const detectFaceDirectly = async (videoElement) => {
    if (!videoElement) return null;
    await loadFaceModels();
    
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 416,
        scoreThreshold: 0.1 
    });

    const detection = await faceapi.detectSingleFace(
        videoElement, 
        detectionOptions
    ).withFaceLandmarks().withFaceDescriptor();

    return detection || null;
};
