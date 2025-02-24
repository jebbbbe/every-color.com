import {
    getContrastRatio,
    randomColorFromBackground,
    getContrastRatiofromRGB,
} from "../src/Library/oppositeColor.js";

import {getFloatArray} from "../src/Library/colorFormats.js"




function testRandomContrastGeneration(hex){
    const rgb = getFloatArray(hex)
    const samples = []
    for(let i = 0; i < ratios.length; i++){
        const rgbTest = randomColorFromBackground(hex,ratios[i])
        samples.push( getContrastRatiofromRGB(rgb, rgbTest))
    }
    return samples
}   
const testNumbers = [
    0x000000,
    0x0000ff,
    0x00ff00,
    0xff0000,
    0xffffff,
    0x753530,
    0x8549de,
    0x8fbda6,
    0x9c998e,
    0x030b54,
    0xab0f51,
]

const ratios = [
    1,
    2.44,
    15.3,
    5.25,
    21,
    2.3,
    4,
    9.99,
    7.36,
    1.17,
    2.91,
]

const myTests = [ 
    {
        run:true,
        log:false,
        name:'oppositeColor testContrastRatio',
        fn:getContrastRatio,
        args:[0x000000],
        ans: [
            1,
            2.44,
            15.3,
            5.25,
            21,
            2.3,
            4,
            9.99,
            7.36,
            1.17,
            2.91,
        ],
    },{
        run:true,
        log:false,
        name:'oppositeColorRandom',
        fn:testRandomContrastGeneration,
        args:[0x000000],
        ans: ratios,
    }
]

describe('color contrast tests', () => {

    for(let i = 0; i < myTests.length; i++ ){
        const currTest = myTests[i]
        if(!currTest.run) continue;
        test(currTest.name, () => {
            const sample = Array(testNumbers.length)
            for(let i = 0; i <sample.length; i++ ){
                sample[i] = currTest.fn(testNumbers[i], ...currTest.args)
            }
            if(currTest.log) console.log(sample, currTest.ans);
            expect(sample).toEqual(currTest.ans);
        });
    }




});