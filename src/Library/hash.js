// let c1 = 0x000000;
// let c2 = 0xffffff;
// let c3 = 0x123456;
// console.log("");
// console.log("");
// console.log("");
// console.log(c1.toString(16).padStart(6, "0"));
// console.log(c2.toString(16).padStart(6, "0"));
// console.log(c3.toString(16).padStart(6, "0"));
// console.log("");
// console.log(remapColor(c1).toString(16).padStart(6, "0"));
// console.log(remapColor(c2).toString(16).padStart(6, "0"));
// console.log(remapColor(c3).toString(16).padStart(6, "0"));
// console.log("");
// console.log(unmapColor(remapColor(c1)).toString(16).padStart(6, "0"));
// console.log(unmapColor(remapColor(c2)).toString(16).padStart(6, "0"));
// console.log(unmapColor(remapColor(c3)).toString(16).padStart(6, "0"));

export function remapColor(color) {
    // Ensure the input is within the valid range
    if (color < 0x000000 || color > 0xffffff) {
        throw new Error("Color out of range. Must be between 0x000000 and 0xFFFFFF.");
    }

    // Use a large prime number and multiplier for scrambling
    const prime = 0x343fd; // Example prime number
    const multiplier = 0x5a5a5a; // Must have a modular multiplicative inverse mod 0x1000000

    // Perform modular multiplication and ensure the result stays within the 24-bit range
    return (color * multiplier + prime) % 0x1000000;
}
export function unmapColor(color) {
    // Ensure the input is within the valid range
    if (color < 0x000000 || color > 0xffffff) {
        throw new Error("Color out of range. Must be between 0x000000 and 0xFFFFFF.");
    }

    // The same prime used in remapColor
    const prime = 0x343fd;
    const multiplier = 0x5a5a5a;

    // Modular multiplicative inverse of the multiplier mod 0x1000000
    const inverseMultiplier = 0xf0e0d1; // Precomputed inverse of 0x5A5A5A mod 0x1000000

    // Reverse the modular multiplication
    return ((color - prime + 0x1000000) * inverseMultiplier) % 0x1000000;
}



// Example usage
// const colors = [0x000000, 0x0000ff, 0x000100, 0x0001ff, 0x000200, 0x000300, 0x0003ff, 0xffffff]; // Example colors
// const mappedColors = colors.map(mapToGradient);
// const unmappedColors = mappedColors.map(unmapToGradient);

// console.log("Original -> Mapped -> Unmapped");
// colors.forEach((original, i) => {
//     console.log(`${original.toString(16).toUpperCase()} -> ${mappedColors[i].toString(16).toUpperCase()} -> ${unmappedColors[i].toString(16).toUpperCase()}`);
// });
export function mapToGradientI(hexColor) {
    /**
     * Maps a hexadecimal color based on reversing every other group of 256 colors.
     *
     * @param {number} hexColor - The color as a decimal representation of the hexadecimal value (0 to 16777215).
     * @returns {number} - The remapped decimal representation of the hexadecimal color.
     */

    // Extract the base 256 group the color is in
    let group = (hexColor >> 8) & 0xffff; // Equivalent to integer division by 256
    // Determine the position within the group
    let position = hexColor & 0xff; // Equivalent to modulo 256
    // Check if the group is odd (reverse order)
    let reversedPosition;
    if (group % 2 === 1) {
        // Reverse the position within the group
        reversedPosition = 255 - position;
    } else {
        // Keep position unchanged for even groups
        reversedPosition = position;
    }
    // Reconstruct the new hexadecimal color value
    let newHexColor = (group << 8) | reversedPosition;
    return newHexColor;
}

export function mapToGradientII(hexColor) {
    /**
     * Maps a hexadecimal color based on reversing every other group of 256 colors
     * and every other group of 256*256 colors.
     *
     * @param {number} hexColor - The color as a decimal representation of the hexadecimal value (0 to 16777215).
     * @returns {number} - The remapped decimal representation of the hexadecimal color.
     */

    // Extract the base 256 group the color is in
    let group = (hexColor >> 8) & 0xffff; // Equivalent to integer division by 256
    let superGroup = (hexColor >> 16) & 0xff; // Determine the 256*256 supergroup

    // Determine the position within the group
    let position = hexColor & 0xff; // Equivalent to modulo 256

    // Check if the group or supergroup is odd (reverse order accordingly)
    let reversedPosition = position;
    if (group % 2 === 1) {
        reversedPosition = 255 - position;
    }

    if (superGroup % 2 === 1) {
        // Reverse the group as well within the supergroup
        group = 255 - group;
    }

    // Reconstruct the new hexadecimal color value
    let newHexColor = (superGroup << 16) | (group << 8) | reversedPosition;
    return newHexColor;
}

export function unmapToGradientI(mappedHexColor) {
    /**
     * Reverses the mapping of a hexadecimal color to retrieve the original color.
     *
     * @param {number} mappedHexColor - The remapped color as a decimal representation of the hexadecimal value.
     * @returns {number} - The original decimal representation of the hexadecimal color.
     */
    // Extract the base 256 group the color is in
    let group = (mappedHexColor >> 8) & 0xffff;
    // Determine the position within the group
    let position = mappedHexColor & 0xff;
    // Check if the group is odd (reverse order)
    let originalPosition;
    if (group % 2 === 1) {
        // Reverse the reversed position to get the original
        originalPosition = 255 - position;
    } else {
        // Keep position unchanged for even groups
        originalPosition = position;
    }
    // Reconstruct the original hexadecimal color value
    let originalHexColor = (group << 8) | originalPosition;
    return originalHexColor;
}



export function unmapToGradientII(mappedHexColor) {
    /**
     * Reverses the mapping of a hexadecimal color to retrieve the original color.
     *
     * @param {number} mappedHexColor - The remapped color as a decimal representation of the hexadecimal value.
     * @returns {number} - The original decimal representation of the hexadecimal color.
     */

    // Extract the base 256 group and supergroup the color is in
    let group = (mappedHexColor >> 8) & 0xffff;
    let superGroup = (mappedHexColor >> 16) & 0xff;

    // Determine the position within the group
    let position = mappedHexColor & 0xff;

    // Reverse the mappings for the group and supergroup
    let originalPosition = position;
    if (group % 2 === 1) {
        originalPosition = 255 - position;
    }

    if (superGroup % 2 === 1) {
        group = 255 - group;
    }

    // Reconstruct the original hexadecimal color value
    let originalHexColor = (superGroup << 16) | (group << 8) | originalPosition;
    return originalHexColor;
}






// Example Usage
// const originalHex = 0xFF5733; // Bright orange
// console.log("Protanopia:", simulateColorBlindness(originalHex, "protanopia").toString(16).padStart(6, '0'));
// console.log("Deuteranopia:", simulateColorBlindness(originalHex, "deuteranopia").toString(16).padStart(6, '0'));
// console.log("Tritanopia:", simulateColorBlindness(originalHex, "tritanopia").toString(16).padStart(6, '0'));
// console.log("Monochromacy:", simulateColorBlindness(originalHex, "monochromacy").toString(16).padStart(6, '0'));

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

// Simulate colorblindness
function simulateColorBlindness(hexColor, type) {
    switch (type) {
        case "protanopia":
            return protanopia(hexColor);
        case "deuteranopia":
            return deuteranopia(hexColor);
        case "tritanopia":
            return tritanopia(hexColor);
        case "monochromacy":
            return monochromacy(hexColor);
        default:
            throw new Error("Unsupported colorblind type");
    }
}


