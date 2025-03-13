import { getContrastRatio, randomColorFromBackground, getContrastRatiofromRGB, getOppositeColor } from "../src/Library/color/oppositeColor.js"

import { getFloatArray,hexStringToHexNum, hexNumToHexString } from "../src/Library/color/colorFormats.js"
import { constants, hashTypes, visionTypes } from "../src/Library/constants.js"

function testRandomContrastGeneration(hex) {
    const rgb = getFloatArray(hex)
    const samples = []
    for (let i = 0; i < ratios.length; i++) {
        const rgbTest = randomColorFromBackground(hex, ratios[i])
        samples.push(getContrastRatiofromRGB(rgb, rgbTest))
    }
    return samples
}

function testOppositeContrast(contrastRatio = 4.5, verbose = false){
    let count = 0;
    const skip = 1 //Math.floor(constants.absoluteMax/6)
    for(let i = 0; i<constants.absoluteMax; i+=skip ){
        const idxColorRGB = getFloatArray(i)
        const idxColorString = hexNumToHexString(i)
        const calcColor = getOppositeColor(idxColorString)
        const calcColorHex = hexStringToHexNum(calcColor)
        const calcColorRGB = getFloatArray(calcColorHex)
        const contrast = getContrastRatiofromRGB(idxColorRGB, calcColorRGB) // rgb number float array
        if(contrast <= contrastRatio){
            if(verbose) console.log(contrast)
            count ++
        }
    }
    // if(verbose) console.log(count)
    return count
}


const testNumbers = [0x000000, 0x0000ff, 0x00ff00, 0xff0000, 0xffffff, 0x753530, 0x8549de, 0x8fbda6, 0x9c998e, 0x030b54, 0xab0f51]

const ratios = [1, 2.44, 15.3, 5.25, 21, 2.3, 4, 9.99, 7.36, 1.17, 2.91]

const myTests = [
    {
        run: false,
        log: false,
        name: "oppositeColor testContrastRatio",
        fn: getContrastRatio,
        args: [0x000000],
        ans: [1, 2.44, 15.3, 5.25, 21, 2.3, 4, 9.99, 7.36, 1.17, 2.91],
    },
    {
        run: false,
        log: false,
        name: "oppositeColor Random",
        fn: testRandomContrastGeneration,
        args: [0x000000],
        ans: ratios,
    },
]

describe("color contrast tests", () => {
    for (let i = 0; i < myTests.length; i++) {
        const currTest = myTests[i]
        if (!currTest.run) continue
        test(currTest.name, () => {
            const sample = Array(testNumbers.length)
            for (let i = 0; i < sample.length; i++) {
                sample[i] = currTest.fn(testNumbers[i], ...currTest.args)
            }
            if (currTest.log) console.log(sample, currTest.ans)
            expect(sample).toEqual(currTest.ans)
        })
    }

    // we want this to be zero..
    test('oppositeColor Contrast 3', () => {
        expect(testOppositeContrast(3)).toBe(8777786);
    });
    test('oppositeColor Contrast 4.5', () => {
        expect(testOppositeContrast(4.5)).toBe(11840730);
    });
    test('oppositeColor Contrast 7', () => {
        expect(testOppositeContrast(7)).toBe(14393660);
    });
})
