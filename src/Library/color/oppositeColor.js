import { getFloatArray } from "./colorFormats.js"

const contrastRequirementsWCAG = {
    normalText: {
        AA: 4.5 / 1,
        AAA: 7 / 1,
    },
    largeText: {
        // 14pt/18.66px is bold or 18pt/24px
        AA: 3 / 1,
        AAA: 4.5 / 1,
    },
    graphicalInterface: {
        AA: 3 / 1,
    },
}

export function getOppositeColor(hexColor) {
    // Remove '#' if present
    hexColor = hexColor.replace(/^#/, "")

    let r, g, b

    // Handle 3-digit HEX (e.g. #abc)
    if (hexColor.length === 3) {
        r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16)
        g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16)
        b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16)
    }
    // Handle 6-digit HEX (e.g. #a1b2c3)
    else if (hexColor.length === 6) {
        r = parseInt(hexColor.substr(0, 2), 16)
        g = parseInt(hexColor.substr(2, 2), 16)
        b = parseInt(hexColor.substr(4, 2), 16)
    }
    // Invalid input
    else {
        throw new Error("Invalid hex color provided: " + hexColor)
    }

    // Invert each channel by subtracting from 255
    const newR = (255 - r).toString(16).padStart(2, "0")
    const newG = (255 - g).toString(16).padStart(2, "0")
    const newB = (255 - b).toString(16).padStart(2, "0")

    // Construct final color
    return `#${newR}${newG}${newB}`
}

function gammaCorrect(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function inverseGammaCorrect(c) {
    return c <= 0.04045 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function relativeLuminance([r, g, b]) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function luminanceToContrast(lum1, lum2) {
    if (lum1 > lum2) {
        return (lum1 + 0.05) / (lum2 + 0.05)
    }
    return (lum2 + 0.05) / (lum1 + 0.05)
    // return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

export function getContrastRatio(hexNum1, hexNum2) {
    const rgb1 = getFloatArray(hexNum1)
    const rgb2 = getFloatArray(hexNum2)
    for (let i = 0; i < 3; i++) {
        rgb1[i] = gammaCorrect(rgb1[i])
        rgb2[i] = gammaCorrect(rgb2[i])
    }
    const lum1 = relativeLuminance(rgb1)
    const lum2 = relativeLuminance(rgb2)
    const contrast = luminanceToContrast(lum1, lum2)
    // return parseFloat(contrast.toFixed(2));
    return Math.floor(contrast * 100) / 100
}

export function getContrastRatiofromRGB(rgb1, rgb2) {
    for (let i = 0; i < 3; i++) {
        rgb1[i] = gammaCorrect(rgb1[i])
        rgb2[i] = gammaCorrect(rgb2[i])
    }
    const lum1 = relativeLuminance(rgb1)
    const lum2 = relativeLuminance(rgb2)
    const contrast = luminanceToContrast(lum1, lum2)
    // return parseFloat(contrast.toFixed(2));
    return Math.floor(contrast * 100) / 100
}

export function randomColorFromBackground(hexNum, contrastRatio) {
    const rgb = getFloatArray(hexNum)
    for (let i = 0; i < 3; i++) {
        rgb[i] = gammaCorrect(rgb[i])
    }
    const lum = relativeLuminance(rgb)
    return generateRandomInContrastRange(lum, contrastRatio)
    
    function generateRandomInContrastRange(L, R, rand = Math.random) {
        let f_min = 0,
        f_max = 1

    let lowerBound = (L + 0.05) / R - 0.05
    let upperBound = R * (L + 0.05) - 0.05

    let P1 = f_max - upperBound
    let P2 = lowerBound - f_min
    let P_total = P1 + P2

    let f
    if (rand() < P1 / P_total) {
        f = upperBound + rand() * (f_max - upperBound)
    } else {
        f = rand() * (lowerBound - f_min)
    }

    f = Math.max(0, Math.min(1, f))

    // Convert the target luminance into an approximate RGB triplet
    let Y = f
    let g_lin = Y / 0.7152
    let g = inverseGammaCorrect(g_lin)

    let r = rand()
    let b = rand()

    r = inverseGammaCorrect(r * (Y / 0.2126))
    b = inverseGammaCorrect(b * (Y / 0.0722))

    return [Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b))]
    }
}

function getOppositeBackgroundCWithContrast(hexNum, backgroundHexNum, contrastRatio = 4.75) {}
function getOppositeForegroundrWithContrast(backgroundHexNum, hexNum, contrastRatio = 4.75) {}

function multiplyMat([r, g, b], [c1, c2, c3]) {
    return [r * c1[0] + r * c1[1] + r * c1[2], g * c2[0] + g * c2[1] + g * c2[2], b * c3[0] + b * c3[1] + b * c3[2]]
}
const visionKernels = {
    default:[
        [1.0,  0.0, 0.0],
        [0.0,  1.0, 0.0],
        [0.0,  0.0, 1.0],
    ],
    protanopia:[
        [0.567,  0.433, 0.0  ],
        [0.558,  0.442, 0.0  ],
        [0.0,    0.242, 0.758],
    ],
    deuteranopia:[
        [0.625, 0.375, 0.0],
        [0.7,   0.3,   0.0],
        [0.0,   0.3,   0.7],
    ],
    tritanopia:[
        [0.95,  0.05,  0.0  ],
        [0.433, 0.567, 0.0  ],
        [0.0,   0.475, 0.525],
    ],
    monochromacy:[
        [0.299, 0.587 ,0.114],
        [0.299, 0.587 ,0.114],
        [0.299, 0.587 ,0.114],
    ],
}    