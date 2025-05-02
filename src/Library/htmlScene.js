import { elements, constants, hashTypes, visionTypes, colorFormats } from "./constants.js"
import * as hashes from "./color/hash.js"
import * as vision from "./color/vision.js"
import * as opposite from "./color/oppositeColor.js"
import { getSafeOpposite } from "./color/safeOpposite.js"
import { hexToColorNames } from "./color/cssColors.js"
import { selectFormat } from "./color/colorFormats.js"

export class htmlScene {
    constructor(displayMode, colorFormat, visibleIndex) {
        this.visibleIndex = visibleIndex
        this.setHTMLArray(elements.ids.main)
        this.displayMode = displayMode
        this.setHashFunction(displayMode)
        this.colorFormat = colorFormat
        this.setColorFormatMode(colorFormat)

        this.setvisionMode(visionTypes.none)
    }
    setHTMLArray(cssClass) {
        this.class = cssClass
        this.htmlArray = document.getElementById(this.class).children
        this.titleElements = new Array(this.htmlArray.length)
        this.colorElements = new Array(this.htmlArray.length)
        let elem
        for (let i = 0; i < this.htmlArray.length; i++) {
            elem = this.htmlArray[i]
            this.titleElements[i] = elem.querySelector(".colName")
            this.colorElements[i] = elem.querySelector(".colHex")
        }
        elem = null
    }
    setHashFunction(newMode = undefined) {
        if (newMode !== undefined) {
            this.displayMode = newMode
        }
        if (this.displayMode === hashTypes.none) {
            this.hash = (i) => i
        } else if (this.displayMode === hashTypes.random) {
            this.hash = (i) => randomHexColor()
        } else if (this.displayMode === hashTypes.gradientI) {
            this.hash = (i) => hashes.mapToGradientI(i)
        } else if (this.displayMode === hashTypes.gradientII) {
            this.hash = (i) => hashes.mapToGradientII(i)
        } else if (this.displayMode === hashTypes.gradientIII) {
            this.hash = (i) => hashes.mapToGradientII(i)
        } else if (this.displayMode === hashTypes.gradientIV) {
            this.hash = (i) => hashes.mapToGradientIV(i)
        }
    }
    setvisionMode(newMode = undefined) {
        if (newMode !== undefined) {
            this.visionMode = newMode
        }
        switch (this.visionMode) {
            case visionTypes.none:
                this.applyVisionMode = undefined
                break
            case visionTypes.protanopia:
                this.applyVisionMode = vision.protanopia
                break
            case visionTypes.deuteranopia:
                this.applyVisionMode = vision.deuteranopia
                break
            case visionTypes.tritanopia:
                this.applyVisionMode = vision.tritanopia
                break
            case visionTypes.monochromacy:
                this.applyVisionMode = vision.monochromacy
                break
            default:
                throw new Error("Unsupported vision type")
        }
    }
    setColorFormatMode(newMode) {
        if (newMode === undefined) return
        this.colorFormat = newMode
        this.hexNumToFormated = selectFormat(this.colorFormat)
    }
    updateHtmlCollection(offset = 0) {
        const max = this.visibleIndex.curr
        const diff = this.visibleIndex.prev - this.visibleIndex.curr
        if (diff > 0) {
            //hide old elems
            for (let i = this.visibleIndex.curr; i < this.visibleIndex.prev; i++) {
                this.htmlArray[i].style.display = "none"
            }
        }
        let element
        for (let i = 0; i < max; i++) {
            element = this.htmlArray[i]
            const index = offset + i
            const hexNumber = getHexidecimal(index)
            let mappedHex = this.hash(hexNumber)

            if (this.visionMode !== visionTypes.none) {
                var colOverwrite = this.hexNumToFormated(mappedHex)
                var newColorOverwrite = hexidecimalToString(mappedHex)
                mappedHex = this.applyVisionMode(mappedHex)
            }

            const colorStringForText = this.hexNumToFormated(mappedHex)
            const newColor = hexidecimalToString(mappedHex)
            let colorName = ""
            if (hexToColorNames.has(newColorOverwrite ?? newColor)) {
                colorName = hexToColorNames.get(newColorOverwrite ?? newColor)
            }

            let colNameElement = this.titleElements[i]
            let colNameTextNode = colNameElement.firstChild || colNameElement.appendChild(document.createTextNode(""))
            colNameTextNode.nodeValue = colorName
            colNameElement = null
            colNameTextNode = null

            let colHexElement = this.colorElements[i]
            let colHexTextNode = colHexElement.firstChild || colHexElement.appendChild(document.createTextNode(""))
            colHexTextNode.nodeValue = colOverwrite ?? colorStringForText
            colHexElement = null
            colHexTextNode = null

            element.style.backgroundColor = newColor
            // element.style.color = opposite.getOppositeColor(newColor)
            element.style.color =  getSafeOpposite(mappedHex)
            
            // console.log(newColor, opposite.getOppositeColor(newColor))
            // console.log(newColor, getSafeOpposite(mappedHex))
            
            // hover -- added 6 ms to css reculation in animation
            // element.style.setProperty('--hover-color', getRandomHexColor());
            // element.style.setProperty('--focus-color', getRandomHexColor());
            element.style.removeProperty("display")
        }
        element = null

        document.documentElement.style.setProperty("--header-color", this.htmlArray[0].style.backgroundColor)
        document.documentElement.style.setProperty("--header-text-color", this.htmlArray[0].style.color)
        document.documentElement.style.setProperty("--main-color", this.htmlArray[max - 1].style.backgroundColor)
        const grey = rgbToGreyscale(window.getComputedStyle(this.htmlArray[0]).backgroundColor)
        document.documentElement.style.setProperty("--header-text-color-greyscale", grey)
        this.visibleIndex.prev = this.visibleIndex.curr
    }
}
function getHexidecimal(decimal) {
    return parseInt(decimal.toString(16), 16)
}
function hexidecimalToString(hexa) {
    return "#" + hexa.toString(16).padStart(6, "0")
}

function randomHexColor() {
    return Math.floor(Math.random() * 0x1000000)
}
function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

function rgbToGreyscale(rgbStr) {
    const result = rgbStr.match(/\d+/g)
    if (!result || result.length < 3) {
        throw new Error("Invalid rgb string format.")
    }
    const [r, g, b] = result.map(Number)
    const grey = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return grey
}
