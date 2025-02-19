const map = { // matches colorFormats from constants 
    "Hexidecimal Number":hexNumToHexNumString,
    "Hexidecimal String":hexNumToHexString,
    "RGB String":hexNumToRgbString,
    "RGB int":hexNumToRgbInt,
    "RGB float":hexNumToRgbfloat,
    "RGB Vector":hexNumToRgbVector,
    "HSL":hexNumToHsl,
    "HSV":hexNumToHsv,
    "HSB":hexNumToHsb,
}

export function selectFormat(format = "Hexidecimal Number"){
    const fn = map[format]
    if(fn === undefined) return map["Hexidecimal Number"]
    return fn;
}


function getIntArray(hexNum){
    hexNum = hexNum & 0xFFFFFF;    // Mask to keep only last 24 bits (RGB) // doesnt happen in our case...?
    let r = (hexNum >> 16) & 0xFF; // Get the most significant byte (Red)
    let g = (hexNum >> 8) & 0xFF;  // Get the middle byte (Green)
    let b = hexNum & 0xFF;         // Get the least significant byte (Blue)
    return [r, g, b];
}

function getFloatArray(hexNum, p=6){
    const array = getIntArray(hexNum)
    array[0] =  parseFloat((array[0]/255).toFixed(p))
    array[1] =  parseFloat((array[1]/255).toFixed(p))
    array[2] =  parseFloat((array[2]/255).toFixed(p))
    return array
}
function forceDecimalFloat(rgb){
    if (rgb[0] === 0 || rgb[0] === 1) rgb[0] += ".";
    if (rgb[1] === 0 || rgb[1] === 1) rgb[1] += ".";
    if (rgb[2] === 0 || rgb[2] === 1) rgb[2] += ".";
}

export function hexNumToHexNumString(hexNum){
    return "0x" + hexNum.toString(16).padStart(6, "0");
}   
export function hexNumToHexString(hexNum){
    return "#" + hexNum.toString(16).padStart(6, "0");
}
export function hexNumToRgbString(hexNum){
    const rgb = getIntArray(hexNum)
    return`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
export function hexNumToRgbInt(hexNum){
    const rgb = getIntArray(hexNum)
    return`[${rgb[0]}, ${rgb[1]}, ${rgb[2]}]`
}
export function hexNumToRgbfloat(hexNum, p = 6){
    const rgb = getFloatArray(hexNum, p)
    forceDecimalFloat(rgb)
    return`[${rgb[0]}, ${rgb[1]}, ${rgb[2]}]`
}
export function hexNumToRgbVector(hexNum, p = 6){
    const rgb = getFloatArray(hexNum, p)
    forceDecimalFloat(rgb)
    return`vec3(${rgb[0]}, ${rgb[1]}, ${rgb[2]});`

}
export function hexNumToHsl(hexNum){
        const rgb = getFloatArray(hexNum)
        let r = rgb[0];
        let g = rgb[1];
        let b = rgb[2];
    
        // Get min, max, and lightness
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let l = (max + min) / 2;
        let s, h;
        // Compute Saturation
        if (max === min) {
            s = 0; // No saturation for grayscale colors
            h = 0; // Hue is undefined but we set it to 0
        } else {
            let d = max - min;
            s = d / (1 - Math.abs(2 * l - 1));
    
            // Compute Hue
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60; 
        }
        const hsl = [
            Math.round(h),
            Math.round(s * 100),
            Math.round(l * 100)  
        ]
        return `hsl(${hsl[0]}°, ${hsl[1]}%, ${hsl[2]}%)`
}
export function hexNumToHsv(hexNum){
        // Ensure hex is a valid number and convert to a string
        const rgb = getFloatArray(hexNum)
        let r = rgb[0];
        let g = rgb[1];
        let b = rgb[2];
    
        // Get max, min, and difference
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;
    
        // Compute Hue (H)
        let h;
        if (delta === 0) {
            h = 0; // No color difference, hue is undefined (set to 0)
        } else if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360; // Ensure positive hue
    
        // Compute Saturation (S)
        let s = max === 0 ? 0 : (delta / max);
        
        // Compute Brightness/Value (B/V)
        let v = max;
    
        const hsv = [
            Math.round(h),
            Math.round(s * 100),
            Math.round(v * 100)
        ]
        return `hsv(${hsv[0]}°, ${hsv[1]}%, ${hsv[2]}%)`

}
export function hexNumToHsb(hexNum){ // these two are the same?
    return "hsb" + hexNumToHsv(hexNum).slice(3)
}