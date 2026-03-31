/**
 * GUARDIAN SUITE 2.0 - SECURITY UTILITIES
 * Centralized logic for data masking and session integrity.
 */

/**
 * Masks an Aadhar number (e.g., 1234 5678 9012 -> XXXX-XXXX-9012)
 */
export const maskAadhar = (aadhar) => {
    if (!aadhar) return 'N/A';
    const clean = aadhar.toString().replace(/\s/g, '');
    if (clean.length < 4) return aadhar;
    return `XXXX-XXXX-${clean.slice(-4)}`;
};

/**
 * Masks a phone number (e.g., 9876543210 -> +91-XXXXX-43210)
 */
export const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    const clean = phone.toString().replace(/[^0-9]/g, '');
    if (clean.length < 5) return phone;
    return `+91-XXXXX-${clean.slice(-5)}`;
};

/**
 * Masks an email (e.g., user@example.com -> u***@example.com)
 */
export const maskEmail = (email) => {
    if (!email) return 'N/A';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    return `${user.charAt(0)}***@${domain}`;
};

/**
 * Generates a stable Device DNA fingerprint (Hardware ID)
 */
export const getDeviceFingerprint = () => {
    try {
        const nav = window.navigator;
        const screen = window.screen;
        
        // Canvas Fingerprinting (2D)
        const canvas2d = document.createElement('canvas');
        const ctx = canvas2d.getContext('2d');
        let canvasData = 'unknown';
        if (ctx) {
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText("GuardianSuite2.0", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("GuardianSuite2.0", 4, 17);
            canvasData = canvas2d.toDataURL();
        }

        // WebGL Fingerprinting (Separate Canvas)
        const canvasGL = document.createElement('canvas');
        const gl = canvasGL.getContext('webgl') || canvasGL.getContext('experimental-webgl');
        const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl?.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL) || 'unknown';
        const vendor = gl?.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL) || 'unknown';

        const raw = [
            nav.userAgent,
            nav.language,
            nav.platform,
            screen.colorDepth,
            screen.width,
            screen.height,
            nav.hardwareConcurrency,
            renderer,
            vendor,
            canvasData.length
        ].join('|');
        
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash) + raw.charCodeAt(i);
            hash |= 0;
        }
        return `DNA-${Math.abs(hash).toString(36).toUpperCase()}`;
    } catch (e) {
        console.warn("Fingerprinting failed, using fallback.", e);
        return `DNA-FALLBACK-${Date.now().toString(36).toUpperCase()}`;
    }
};
