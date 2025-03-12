// Utility to convert HEX to RGB
function hexToRgb(hex) {
    return {
        r: (hex >> 16) & 255,
        g: (hex >> 8) & 255,
        b: hex & 255
    };
}

// Utility to convert RGB to HEX
function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b);
}

// Protanopia (Red-weak) simulation
export function protanopia(hex) {
    const { r, g, b } = hexToRgb(hex);
    const newR = 0.567 * r + 0.433 * g;
    const newG = 0.558 * r + 0.442 * g;
    const newB = 0.0 * r + 0.242 * g + 0.758 * b;
    return rgbToHex(
        Math.min(255, Math.max(0, Math.round(newR))),
        Math.min(255, Math.max(0, Math.round(newG))),
        Math.min(255, Math.max(0, Math.round(newB)))
    );
}

// Deuteranopia (Green-weak) simulation
export function deuteranopia(hex) {
    const { r, g, b } = hexToRgb(hex);
    const newR = 0.625 * r + 0.375 * g;
    const newG = 0.7 * r + 0.3 * g;
    const newB = 0.0 * r + 0.3 * g + 0.7 * b;
    return rgbToHex(
        Math.min(255, Math.max(0, Math.round(newR))),
        Math.min(255, Math.max(0, Math.round(newG))),
        Math.min(255, Math.max(0, Math.round(newB)))
    );
}

// Tritanopia (Blue-weak) simulation
export function tritanopia(hex) {
    const { r, g, b } = hexToRgb(hex);
    const newR = 0.95 * r + 0.05 * g;
    const newG = 0.433 * r + 0.567 * g;
    const newB = 0.475 * g + 0.525 * b;
    return rgbToHex(
        Math.min(255, Math.max(0, Math.round(newR))),
        Math.min(255, Math.max(0, Math.round(newG))),
        Math.min(255, Math.max(0, Math.round(newB)))
    );
}

// Monochromacy (Complete colorblindness) simulation
export function monochromacy(hex) {
    const { r, g, b } = hexToRgb(hex);
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return rgbToHex(
        Math.min(255, Math.max(0, Math.round(gray))),
        Math.min(255, Math.max(0, Math.round(gray))),
        Math.min(255, Math.max(0, Math.round(gray)))
    );
}

