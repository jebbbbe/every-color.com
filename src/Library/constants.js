export const constants = {
    absoluteMin: 0,
    absoluteMax: 16777216 - 1, // 256 * 256 * 256
    start: 0, //16777216 - 100,
    maxRows: 100,
}

export const hashTypes = {
    none: "none",
    random: "random",
    gradientI: "gradient I",
    gradientII: "gradient II",
    gradientII: "gradient II",
    gradientIII: "gradient III",
    gradientIV: "gradient IV",
    gradientV: "gradient V",
}

export const visionTypes = {
    none: "Default",
    protanopia: "Protanopia",
    deuteranopia: "Deuteranopia",
    tritanopia: "Tritanopia",
    monochromacy: "Monochromacy",
}

export const colorFormats = {
    hexidecimalNumber: "Hexidecimal Number", // 0xff00ff
    hexidecimalString: "Hexidecimal String", // #ff00ff
    rgbString: "RGB String", //rgb(255, 87, 51)
    rgbInt: "RGB int", // [255,0,255]
    rgbfloat: "RGB float", // [1.0,0.123213,1.0]
    rgbVector: "RGB Vector", // vec3(1.0,0.123213,1.0);
    hsl: "HSL", //hsl(14, 100%, 60%)
    hsv: "HSV", //hsv(14, 80%, 100%)
    hsb: "HSB", //hsb(14, 80%, 100%) // same format as above
    index: "Index",
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
    hexidecimalAlphaNumber: "Hexidecimal Alpha Number", // 0xff00ffff
    hexidecimalAlphaString: "hexidecimal Alpha String", // #ff00ffff
    rgbaString: "RGBA String", //rgba(255, 87, 51, 0.8)
    rgbaInt: "RGBAint", // [255,0,255,255]
    rgbafloat: "RGBAfloat", // [1.0,0.123213,1.0, 1.0]
    rgbaVector: "RGBAvector", // vec3(1.0,0.123213,1.0, 1.0);
    hsla: "HSLA", //hsla(14, 100%, 60%, 0.8)
}

export const elements = {
    ids: {
        //content
        root: "root",
        header: "header",
        template: "template",
        main: "row-holder",

        //icons
        iconPlay: "play-button",
        iconFullscreen: "fullscreen-button",
        iconText_hide: "hide-text-button",
        iconDescription: "desciption-button",
        iconCode: "code-button",
        iconSettings: "openSettings",

        //setting
        settingsModal: "settingsModal",
        settingsCloseModal: "closeModal",
        settingsColorFormat: "colorFormat",
        settingsvisionSelect: "visionSelect",
        settingsHashSelect: "hashSelect",
        // useAlpha:"useAlpha",
    },
    classes: {
        loader: "loader",
        scrollbar: "custom-scrollbar",
        scrollThumb: "scroll-thumb",
        template2: "row-thing",
    },
}

export const icons = {
    paths: {
        play: "/assets/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        pause: "/assets/pause_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        fullscreen: "/assets/fullscreen_26dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        fullscreen_exit: "/assets/fullscreen_exit_26dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        text_hide: "/assets/font_download_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        text_show: "/assets/font_download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        description: "/assets/description_26dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        code: "/assets/code_26dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        settings: "/assets/settings_26dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
    },
    ids: {
        play: "play-button",
        fullscreen: "fullscreen-button",
        text_hide: "hide-text-button",
        description: "desciption-button",
        code: "code-button",
        settings: "openSettings",
    },
    defaults: {
        iconPlay: "play",
        iconFullscreen: "fullscreen",
        iconText_hide: "text_hide",
        iconDescription: "description",
        iconCode: "code",
        iconSettings: "settings",
    },
    content: {},
}

linkElements()
function linkElements(elemObj = elements) {
    for (let id in elemObj.ids) {
        elemObj[id] = document.getElementById(elemObj.ids[id])
    }
    for (let className in elemObj.classes) {
        elemObj[className] = document.querySelector("." + elemObj.classes[className])
    }
    // console.log(elemObj)
}
