export const constants = {
    absoluteMin: 0,
    absoluteMax:16777216 - 1,// 256 * 256 * 256
    start:0,//16777216 - 100,
}

export const hashTypes = {
    "none":"none",
    "random":"random",
    "gradientI":"gradient I",
    "gradientII":"gradient II",
    "gradientII":"gradient II",
    "gradientIII":"gradient III",
    "gradientIV":"gradient IV",
    "gradientV":"gradient V",
}

export const colorBlindTypes = {
    "none":"None",
    "protanopia":"Protanopia",
    "deuteranopia":"Deuteranopia",
    "tritanopia":"Tritanopia",
    "monochromacy":"Monochromacy",
}



export const colorFormats = {
    "hexidecimalNumber":"Hexidecimal Number", // 0xff00ff
    "hexidecimalString":"Hexidecimal String",  // #ff00ff
    "rgbString":"RGB String",                 //rgb(255, 87, 51)
    "rgbInt":"RGB int",                        // [255,0,255]                     
    "rgbfloat":"RGB float",                    // [1.0,0.123213,1.0]              
    "rgbVector":"RGB Vector",                  // vec3(1.0,0.123213,1.0);
    "hsl":"HSL",                              //hsl(14, 100%, 60%)
    "hsv":"HSV",                              //hsv(14, 80%, 100%)
    "hsb":"HSB",                              //hsb(14, 80%, 100%) // same format as above

    // more strange ones: 
    // CIEXYZ
    // CIELAB (Lab)
    // LCH (Lightness, Chroma, Hue) / HCL
    // HWB (Hue, Whiteness, Blackness)
    // YUV
    // YIQ
    // Color Temperature (Kelvin)
    // Pantone/Spot Colors
}
// all those formats have weird alpha variations
export const colorAlphaFormats = {
    "hexidecimalAlphaNumber":"Hexidecimal Alpha Number", // 0xff00ffff
    "hexidecimalAlphaString":"hexidecimal Alpha String",  // #ff00ffff
    "rgbaString":"RGBA String",//rgba(255, 87, 51, 0.8)
    "rgbaInt":"RGBAint", // [255,0,255,255]
    "rgbafloat":"RGBAfloat",// [1.0,0.123213,1.0, 1.0]
    "rgbaVector":"RGBAvector",// vec3(1.0,0.123213,1.0, 1.0);
    "hsla":"HSLA"//hsla(14, 100%, 60%, 0.8)
}
