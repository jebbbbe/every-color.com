import {getFloatArray} from "./colorFormats.js"

const contrastRequirementsWCAG={
    normalText:{
        AA:4.5/1,
        AAA:7/1,
    },
    largeText:{ // 14pt/18.66px is bold or 18pt/24px 
        AA:3/1,
        AAA: 4.5/1,
    },
    graphicalInterface:{
        AA:3/1,
    },
}

function getOppositeColor(hexColor) { // old 
    // Remove '#' if present
    hexColor = hexColor.replace(/^#/, "");

    let r, g, b;

    // Handle 3-digit HEX (e.g. #abc)
    if (hexColor.length === 3) {
        r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16);
        g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16);
        b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16);
    }
    // Handle 6-digit HEX (e.g. #a1b2c3)
    else if (hexColor.length === 6) {
        r = parseInt(hexColor.substr(0, 2), 16);
        g = parseInt(hexColor.substr(2, 2), 16);
        b = parseInt(hexColor.substr(4, 2), 16);
    }
    // Invalid input
    else {
        throw new Error("Invalid hex color provided: " + hexColor);
    }

    // Invert each channel by subtracting from 255
    const newR = (255 - r).toString(16).padStart(2, "0");
    const newG = (255 - g).toString(16).padStart(2, "0");
    const newB = (255 - b).toString(16).padStart(2, "0");

    // Construct final color
    return `#${newR}${newG}${newB}`;
}


function relativeLuminance([r, g, b]) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function gammaCorrect(c) {
    return c <= 0.04045 ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function getContrastRatio(hexNum1, hexNum2) {
    const rgb1 = getFloatArray(hexNum1)
    const rgb2 = getFloatArray(hexNum2)
    for(let i=0; i < 3; i ++){
        rgb1[i] = gammaCorrect(rgb1[i])
        rgb2[i] = gammaCorrect(rgb2[i])
    }
    const lum1 = relativeLuminance(rgb1);
    const lum2 = relativeLuminance(rgb2);
    console.log(lum1)
    console.log(lum2)
    const contrast = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return contrast
}


function getOppositeBackgroundCWithContrast(hexNum, backgroundHexNum, contrastRatio = 4.75){

}
function getOppositeForegroundrWithContrast(backgroundHexNum, hexNum, contrastRatio = 4.75){

}