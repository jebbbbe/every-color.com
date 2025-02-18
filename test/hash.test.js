import * as hashes from "../src/Library/hash.js"
import { constants, hashTypes, colorBlindTypes } from "../src/Library/constants.js";


// randomHexColor()
// hashes.mapToGradientI(i)
// hashes.mapToGradientII(0)
function add(a,b){
    return a+b
}
function subtract(a,b){
    return a-b
}



describe('Math functions', () => {
    test('adds two numbers correctly', () => {
        expect(add(2, 3)).toBe(5);
    });

    test('subtracts two numbers correctly', () => {
        expect(subtract(5, 2)).toBe(3);
    });

    test('handles negative numbers', () => {
        expect(add(-2, -3)).toBe(-5);
        expect(subtract(-5, -2)).toBe(-3);
    });
});