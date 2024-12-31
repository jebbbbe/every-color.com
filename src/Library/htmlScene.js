import { constants,hashTypes, colorBlindTypes } from "./constants.js";
import * as hashes from "./hash.js"
import { hexToColorNames } from "./cssColors.js"

export class htmlScene {
    constructor(cssClass,displayMode) {
        this.setHTMLArray(cssClass);
        this.displayMode = displayMode
        this.setHashFunction()
        this.setColorBlindMode(colorBlindTypes.none)
    }
    setHTMLArray(cssClass) {
        this.class = cssClass;
        const holder = document.getElementById(this.class);
        this.htmlArray = holder.children;
    }
    setHashFunction(newMode = undefined){
        if(newMode !== undefined){
            this.displayMode = newMode
        }
        this.rehash = null
        if( this.displayMode === hashTypes.none ){
            this.hash = i => i
        }else if ( this.displayMode === hashTypes.random ){
            this.hash = i => randomHexColor()
        }else if ( this.displayMode === hashTypes.gradientI ){
            this.hash = i =>  hashes.mapToGradient(i)
            this.rehash = i => hashes.unmapToGradient(i)
        }
    }
    setColorBlindMode(newMode = undefined){
        if(newMode !== undefined){
            this.colorBlindMode = newMode
        }
        switch (this.colorBlindMode) {
            case colorBlindTypes.none:
                this.colorAsist = undefined
                break;
            case colorBlindTypes.protanopia:
                this.colorAsist = hashes.protanopia
                break;
            case colorBlindTypes.deuteranopia:
                this.colorAsist = hashes.deuteranopia
                break;
            case colorBlindTypes.tritanopia:
                this.colorAsist = hashes.tritanopia
                break;
            case colorBlindTypes.monochromacy:
                this.colorAsist = hashes.monochromacy
                break;
            default:
                throw new Error("Unsupported colorblind type");
        }
    }
    updateColors(offset = 0) {
        for (let i = 0; i < this.htmlArray.length; i++) {
            const element = this.htmlArray[i];
            const index = offset + i;
            const hexIndex = "0x" + index.toString(16).padStart(6, "0");
            const decIndex = index.toString(10).padStart(8, "0");
            const hexNumber = getHexidecimal(index)
            let mappedHex = this.hash(hexNumber)
            
            let remappedHex = ""
            if(this.rehash){
                remappedHex = this.rehash(mappedHex)
                remappedHex = hexidecimalToString(remappedHex)
            }
            if(this.colorBlindMode !== colorBlindTypes.none){
                var colOverwrite = hexidecimalToString(mappedHex)
                var newColorOverwrite = hexidecimalToString(mappedHex);
                mappedHex = this.colorAsist(mappedHex)
            }

            const newColor = hexidecimalToString(mappedHex);
            let colorName = ""
            if( hexToColorNames.has(newColorOverwrite ?? newColor) ){
                colorName = hexToColorNames.get(newColorOverwrite ?? newColor)
            }

            element.querySelector(".index").innerHTML = decIndex
            element.querySelector(".hexNum").innerHTML = hexIndex;
            element.querySelector(".colName").innerHTML = colorName;
            element.querySelector(".colHex").innerHTML = colOverwrite ?? newColor;
            element.querySelector(".rehash").innerHTML = remappedHex;
            element.style.backgroundColor = newColor;
            element.style.color = getOppositeColor(newColor);
        }
    }
}
function getHexidecimal(decimal){
    return parseInt(decimal.toString(16), 16);
}
function hexidecimalToString(hexa){
    return "#" + hexa.toString(16).padStart(6, "0");
}

function randomHexColor() {
    return Math.floor(Math.random() * 0x1000000);
}


function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return parseInt(color);
}

function getOppositeColor(hexColor) {
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
