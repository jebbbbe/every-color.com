import * as hashes from "../src/Library/hash.js"
import { constants, hashTypes, colorBlindTypes } from "../src/Library/constants.js";

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

function testHash(hash = hashTypes.gradientI){

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
    }
    let cnt = 0
    let prev = hashFunciton(0)
    // for(let i = 1; i<400; i++){
    for(let i = 1; i<constants.absoluteMax; i++){
        const curr = hashFunciton(i)
        const d = testColorDifference(prev, curr)
        if(d > 1){
            cnt++
        }
        prev = curr
    }
    console.log(cnt)
    return cnt
}

describe('Math functions', () => {
    test('testHashes', () => {
        expect(testHash(hashTypes.none)).toBe(65535);
        expect(testHash(hashTypes.gradientI)).toBe(255);
        expect(testHash(hashTypes.gradientII)).toBe(253);
    });
});