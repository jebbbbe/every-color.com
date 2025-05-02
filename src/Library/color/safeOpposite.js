import { getFloatArray } from "./colorFormats.js"

export function getSafeOpposite(color = 0xff0000, contrast = 4.5, tween = 2.5) {
    let rgb = getFloatArray(color)
    let opp = sdfBoundarySolution(rgb)
    const r = (255 - Math.floor(opp[0] * 255)).toString(16).padStart(2, "0")
    const g = (255 - Math.floor(opp[1] * 255)).toString(16).padStart(2, "0")
    const b = (255 - Math.floor(opp[2] * 255)).toString(16).padStart(2, "0")
    return `#${r}${g}${b}`
}

// ——— Vector Math Helpers ———
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mulScalar = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const length = v => Math.hypot(v[0], v[1], v[2]);
const normalize = v => {
    const len = length(v);
    return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
};
const absVec = v => [Math.abs(v[0]), Math.abs(v[1]), Math.abs(v[2])];
const maxVec = (a, b) => [
    Math.max(a[0], b[0]),
    Math.max(a[1], b[1]),
    Math.max(a[2], b[2])
];

// ——— Converted Functions ———

// Test if point is on the “negative” side of plane
function isPointBelowPlane(testPoint, planePoint, planeNormal) {
    const v = sub(testPoint, planePoint);
    return dot(v, planeNormal) < 0;
}

// SDF to infinite plane (point-normal form)
function sdPlane(p, planePoint, planeNormal) {
    const n = normalize(planeNormal);
    return dot(sub(p, planePoint), n);
}

// SDF to axis-aligned box (center + half-sizes)
function sdBox(p, boxCenter, boxHalfSize) {
    const d = sub(absVec(sub(p, boxCenter)), boxHalfSize);
    const dMax0 = maxVec(d, [0, 0, 0]);
    const outsideDist = length(dMax0);
    const insideDist = Math.min(
        Math.max(d[0], Math.max(d[1], d[2])),
        0
    );
    return outsideDist + insideDist;
}

// SDF of plane clipped by box (intersection)
function sdPlaneBoundedByCube(p, planePoint, planeNormal, boxCenter, boxHalfSize) {
    const dPlane = sdPlane(p, planePoint, planeNormal);
    const dBox = sdBox(p, boxCenter, boxHalfSize);
    return Math.max(dPlane, dBox);
}

// Move point p by distance d along direction n
function movePoint(p, n, d) {
    const nn = normalize(n);
    return add(p, mulScalar(nn, d));
}

// ——— Your boundary-solution logic ———
function sdfBoundarySolution(transformedColor) {
    // rename for clarity
    const p = transformedColor;

    const boxCenter = [0.5, 0.5, 0.5];
    const boxHalfSize = [0.5, 0.5, 0.5];

    let blackPlaneOrigin = [0.5433477, 0.1086155, 0.4332448];
    const centerPlaneOrigin = [0.5, 0.5, 0.5];
    let whitePlaneOrigin = [0.4556161, 0.8910283, 0.5665111];

    const sharedPlaneNormal = normalize([0.2833108, 0.9542531, 0.0955819]);

    const offsetDistance = 1.0 / 255.0;
    blackPlaneOrigin = movePoint(blackPlaneOrigin, sharedPlaneNormal, -offsetDistance);
    whitePlaneOrigin = movePoint(whitePlaneOrigin, sharedPlaneNormal, offsetDistance);

    if (isPointBelowPlane(p, blackPlaneOrigin, sharedPlaneNormal)) {   // below black → return black
        return p;
    }
    if (!isPointBelowPlane(p, whitePlaneOrigin, sharedPlaneNormal)) { // above white → return white
        return p;
    }
    if (isPointBelowPlane(p, centerPlaneOrigin, sharedPlaneNormal)) { // between black and center
        const d = sdPlaneBoundedByCube(p, blackPlaneOrigin, sharedPlaneNormal, boxCenter, boxHalfSize);
        return movePoint(p, sharedPlaneNormal, -d);

    } else {// between center and white
        // note: flip normal for the white side
        const d = sdPlaneBoundedByCube(p, whitePlaneOrigin, mulScalar(sharedPlaneNormal, -1), boxCenter, boxHalfSize);
        return movePoint(p, sharedPlaneNormal, d);
    }
}