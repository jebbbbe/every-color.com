import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollControls } from "/Library/noScrollControls.js"
import { htmlScene } from "/Library/htmlScene.js"



let scrollManager;

const mainClass = "row-holder"
const rowClass = "row-thing"
const camera = new noScrollCamera(mainClass,rowClass)
// const controls = new noScrollControls(mainClass)
const scene = new htmlScene(mainClass)

camera.resize()
scene.randomizeColors()


let c1 = 0x000000
let c2 = 0xFFFFFF
let c3 = 0x123456
console.log("")
console.log("")
console.log("")
console.log(c1.toString(16).padStart(6, '0'))
console.log(c2.toString(16).padStart(6, '0'))
console.log(c3.toString(16).padStart(6, '0'))
console.log("")
console.log(remapColor(c1).toString(16).padStart(6, '0'));
console.log(remapColor(c2).toString(16).padStart(6, '0'));
console.log(remapColor(c3).toString(16).padStart(6, '0')); 
console.log("")
console.log(unmapColor(remapColor(c1)).toString(16).padStart(6, '0'));
console.log(unmapColor(remapColor(c2)).toString(16).padStart(6, '0'));
console.log(unmapColor(remapColor(c3)).toString(16).padStart(6, '0')); 


window.addEventListener('wheel', () => {
    scene.randomizeColors()
});

window.addEventListener('resize', () => {
    camera.resize()
});


function remapColor(color) {
    // Ensure the input is within the valid range
    if (color < 0x000000 || color > 0xFFFFFF) {
        throw new Error("Color out of range. Must be between 0x000000 and 0xFFFFFF.");
    }

    // Use a large prime number and multiplier for scrambling
    const prime = 0x343FD; // Example prime number
    const multiplier = 0x5A5A5A; // Must have a modular multiplicative inverse mod 0x1000000

    // Perform modular multiplication and ensure the result stays within the 24-bit range
    return ((color * multiplier) + prime) % 0x1000000;
}

function unmapColor(color) {
    // Ensure the input is within the valid range
    if (color < 0x000000 || color > 0xFFFFFF) {
        throw new Error("Color out of range. Must be between 0x000000 and 0xFFFFFF.");
    }

    // The same prime used in remapColor
    const prime = 0x343FD;
    const multiplier = 0x5A5A5A;

    // Modular multiplicative inverse of the multiplier mod 0x1000000
    const inverseMultiplier = 0xF0E0D1; // Precomputed inverse of 0x5A5A5A mod 0x1000000

    // Reverse the modular multiplication
    return ((color - prime + 0x1000000) * inverseMultiplier) % 0x1000000;
}












