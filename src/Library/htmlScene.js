import { elements, constants,hashTypes, colorBlindTypes, colorFormats } from "./constants.js";
import * as hashes from "./hash.js"
import { hexToColorNames } from "./cssColors.js"
import {selectFormat } from "./colorFormats.js"

export class htmlScene {
    constructor(displayMode, colorFormat, visibleIndex) {
        this.visibleIndex = visibleIndex
        this.setHTMLArray(elements.ids.main);
        this.displayMode = displayMode
        this.setHashFunction(displayMode)
        this.colorFormat = colorFormat
        this.setColorFormatMode(colorFormat)

        this.setColorBlindMode(colorBlindTypes.none)
    }
    setHTMLArray(cssClass) {
        this.class = cssClass;
        this.htmlArray = document.getElementById(this.class).children;
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
            this.hash = i =>  hashes.mapToGradientI(i)
            this.rehash = i => hashes.unmapToGradientI(i)
        }else if ( this.displayMode === hashTypes.gradientII ){
            this.hash = i =>  hashes.mapToGradientII(i)
            this.rehash = i => hashes.unmapToGradientII(i)
        }else if ( this.displayMode === hashTypes.gradientIII ){
            this.hash = i =>  hashes.mapToGradientII(i)
        }else if ( this.displayMode === hashTypes.gradientIV ){
            this.hash = i =>  hashes.mapToGradientIV(i)
        }else if ( this.displayMode === hashTypes.gradientV ){
            this.hash = i =>  hashes.mapToGradientV(i)
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
    setColorFormatMode(newMode){
        if(newMode === undefined) return
        this.colorFormat = newMode;
        this.hexNumToFormated = selectFormat(this.colorFormat)
    }
    updateHtmlCollection(offset = 0) {
        requestAnimationFrame(()=>{
            const max = this.visibleIndex.curr
            const diff = this.visibleIndex.prev - this.visibleIndex.curr
            if(diff > 0){//hide old elems
                for(let i = this.visibleIndex.curr; i < this.visibleIndex.prev; i ++){
                    this.htmlArray[i].style.display = "none";
                }
            }
            let element
            for (let i = 0; i < max; i++) {
                element = this.htmlArray[i];
                const index = offset + i;
                // const hexIndex = "0x" + index.toString(16).padStart(6, "0");
                // const decIndex = index.toString(10).padStart(8, "0");
                const hexNumber = getHexidecimal(index)
                let mappedHex = this.hash(hexNumber)
                
                let remappedHex = ""
                if(this.rehash){
                    remappedHex = this.rehash(mappedHex)
                    remappedHex = hexidecimalToString(remappedHex)
                }
                if(this.colorBlindMode !== colorBlindTypes.none){
                    // var colOverwrite = hexidecimalToString(mappedHex)
                    var colOverwrite = this.hexNumToFormated(mappedHex)
                var newColorOverwrite = hexidecimalToString(mappedHex);
                mappedHex = this.colorAsist(mappedHex)
                }
                
                const colorStringForText = this.hexNumToFormated(mappedHex);
                const newColor = hexidecimalToString(mappedHex);
                let colorName = ""
                if( hexToColorNames.has(newColorOverwrite ?? newColor) ){
                    colorName = hexToColorNames.get(newColorOverwrite ?? newColor)
                }
                let tmp = colOverwrite ?? colorStringForText
                // tmp = tmp.toUpperCase()

                // element.querySelector(".index").innerHTML = decIndex
                // element.querySelector(".hexNum").innerHTML = hexIndex;
                // element.querySelector(".rehash").innerHTML = remappedHex;

                // element.querySelector(".colName").textContent = colorName;
                // element.querySelector(".colHex").textContent  = tmp;

                let colNameElement = element.querySelector(".colName");
                let colNameTextNode = colNameElement.firstChild || colNameElement.appendChild(document.createTextNode(''));
                colNameTextNode.nodeValue = colorName;
                colNameElement = null
                colNameTextNode = null
                
                let colHexElement = element.querySelector(".colHex");
                let colHexTextNode = colHexElement.firstChild || colHexElement.appendChild(document.createTextNode(''));
                colHexTextNode.nodeValue = tmp;
                colHexElement = null
                colHexTextNode = null
                

                // const colHex = element.querySelector(".colHex")
                // window.test = colHex
                // console.log(colHex)
                // colName.firstChild.nodeValue = colorName;
                // const colHex = element.querySelector(".colHex")
                // colHex.firstChild.nodeValue  = tmp;
                // element.querySelector(".colHex").innerHTML = tmp  + " " +tmp  + " " +tmp  + " " +tmp  + " " +tmp  + " " +tmp  + " " +tmp;
                
                /*
                let colNameElem = element.querySelector(".colName").textContent
                if (!colNameElem._textNode) {
                    colNameElem._textNode = document.createTextNode("");
                    colNameElem.appendChild(colNameElem._textNode);
                }
                colNameElem._textNode.nodeValue = colorName
                colNameElem = null
                let colHexElem = element.querySelector(".colHex").textContent
                if (!colHexElem._textNode) {
                    colHexElem._textNode = document.createTextNode("");
                    colHexElem.appendChild(colHexElem._textNode);
                }
                colHexElem._textNode.nodeValue = tmp
                colHexElem = null
                */


                element.style.backgroundColor = newColor;
                element.style.color = getOppositeColor(newColor);
                
                // hover -- added 6 ms to css reculation in animation
                // element.style.setProperty('--hover-color', getRandomHexColor());
                // element.style.setProperty('--focus-color', getRandomHexColor());
                element.style.removeProperty("display")
            }
            element = null
            
            document.documentElement.style.setProperty('--header-color', this.htmlArray[0].style.backgroundColor);
            document.documentElement.style.setProperty('--header-text-color', this.htmlArray[0].style.color);
            document.documentElement.style.setProperty('--main-color', this.htmlArray[max-1].style.backgroundColor);
            this.visibleIndex.prev = this.visibleIndex.curr
        })
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
function getRandomHexColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
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
