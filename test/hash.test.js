import * as hashes from "../src/Library/hash.js"
import { constants, hashTypes, visionTypes } from "../src/Library/constants.js";

function hexNumToArry(hexNumber) {
    hexNumber = hexNumber & 0xFFFFFF; // Mask to keep only last 24 bits (RGB)
    let r = (hexNumber >> 16) & 0xFF; // Get the most significant byte (Red)
    let g = (hexNumber >> 8) & 0xFF;  // Get the middle byte (Green)
    let b = hexNumber & 0xFF;         // Get the least significant byte (Blue)
    return [r, g, b];
}

function testColorDifference(hexNumA,hexNumB){
    let a = hexNumToArry(hexNumA)
    let b = hexNumToArry(hexNumB)
    return Math.sqrt( (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2 )
}


export function selectHash(hash = hashTypes.gradientI){
    if( hash === hashTypes.none ){
        var hashFunciton = i => i
    }else if ( hash === hashTypes.random ){
        var hashFunciton = i => randomHexColor()
    }else if ( hash === hashTypes.gradientI ){
        var hashFunciton = i =>  hashes.mapToGradientI(i)
        var rehashFunciton = i => hashes.unmapToGradientI(i)
    }else if ( hash === hashTypes.gradientII ){
        var hashFunciton = i =>  hashes.mapToGradientII(i)
        var rehashFunciton = i => hashes.unmapToGradientII(i)
    }else if ( hash === hashTypes.gradientIII ){
        var hashFunciton = i =>  hashes.mapToGradientIII(i)
    }else if ( hash === hashTypes.gradientIV ){
        var hashFunciton = i =>  hashes.mapToGradientIV(i)
    }else if ( hash === hashTypes.gradientV ){
        var hashFunciton = i =>  hashes.mapToGradientV(i)
    }
    return [hashFunciton,rehashFunciton]
}
function testHash(hash = hashTypes.gradientI, verbose = false){
    let [hashFunciton,rehashFunciton] = selectHash(hash)
    let array = []
    let prev = hashFunciton(0)
    for(let i = 1; i<constants.absoluteMax; i++){
        const curr = hashFunciton(i)
        const d = testColorDifference(prev, curr)
        if(d > 1){
            array.push(i-1)
        }
        prev = curr
    }
    if(verbose) console.log(array)
    return array.length
}

describe('hash functions', () => {
    const verbose = false
    test('none', () => {
        expect(testHash(hashTypes.none,verbose)).toBe(65535);
    });
    test('gradientI', () => {
        expect(testHash(hashTypes.gradientI,verbose)).toBe(255);
    });
    test('gradientII', () => {
        expect(testHash(hashTypes.gradientII,verbose)).toBe(253);
    });
    test('gradientIII', () => {
        expect(testHash(hashTypes.gradientIII,verbose)).toBe(65280);
    });
    test('gradientIV', () => {
        expect(testHash(hashTypes.gradientIV,verbose)).toBe(0); // winner
    });
    test('gradientV', () => {
        expect(testHash(hashTypes.gradientV,verbose)).toBe(255);
    });
});