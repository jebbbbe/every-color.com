import * as hashes from "../src/Library/hash.js"
import { constants, hashTypes, colorBlindTypes } from "../src/Library/constants.js";
import { selectHash } from "./hash.test.js"



function testReHash(hash = hashTypes.gradientI, verbose = false){
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
        expect(testReHash(hashTypes.none,verbose)).toBe(65535);
    });
    test('gradientI', () => {
        expect(testReHash(hashTypes.gradientI,verbose)).toBe(255);
    });
    test('gradientII', () => {
        expect(testReHash(hashTypes.gradientII,verbose)).toBe(253);
    });
    test('gradientIII', () => {
        expect(testReHash(hashTypes.gradientIII,verbose)).toBe(65280);
    });
    test('gradientIV', () => {
        expect(testReHash(hashTypes.gradientIV,verbose)).toBe(0); // winner
    });
    test('gradientV', () => {
        expect(testReHash(hashTypes.gradientV,verbose)).toBe(255);
    });
});