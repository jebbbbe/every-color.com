import * as hashes from "../src/Library/color/hash.js"
import { constants, hashTypes, visionTypes } from "../src/Library/constants.js";
import { selectHash } from "./hash.test.js"



function testReHash(hash = hashTypes.gradientI, verbose = false){
    let [hashFunciton,rehashFunciton] = selectHash(hash)
    if( rehashFunciton === undefined )return undefined; //just return correct ans if funtion inst defined, i dont care about those results
    let count = 0
    for(let i = 0; i<constants.absoluteMax; i+=1){
        const hash = hashFunciton(i)
        const rehash = rehashFunciton(hash)
        if(rehash !== i){
            count ++
        }
    }
    return count
}

describe('rehash functions', () => {
    test('none', () => {
        expect(testReHash(hashTypes.none)).toBe(undefined);
    });
    test('gradientI', () => {
        expect(testReHash(hashTypes.gradientI)).toBe(0);
    });
    test('gradientII', () => {
        expect(testReHash(hashTypes.gradientII)).toBe(8388607);
    });
    test('gradientIII', () => {
        expect(testReHash(hashTypes.gradientIII)).toBe(0);
    });
    test('gradientIV', () => {
        expect(testReHash(hashTypes.gradientIV)).toBe(0);
    });
});