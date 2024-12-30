import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { constants } from "/Library/constants.js"

// export const constants = {
//     absoluteMin: 0,
//     absoluteMax:16777216 - 1,// 256 * 256 * 256
//     start:0,//16777216 - 100,
// }



const mainClass = "row-holder"
const rowClass = "row-thing"
const scrollFactor = 10
const camera = new noScrollCamera(mainClass,rowClass,scrollFactor,constants.start)
const scene = new htmlScene(mainClass)
const scrollbar = new noScrollBar();

camera.resize()
scene.updateColors(camera.position)
console.log("REMOVE LOADER")



// Event listeners
window.addEventListener("resize", () => {
    camera.resize()
    scrollbar.handleResize()
    scene.updateColors(camera.position)
});

scrollbar.thumb.addEventListener("mousedown", (e) => {
    scrollbar.handleMouseDown(e)
});

document.addEventListener("mousemove", (e) => {
    const update = scrollbar.handleMouseMove(e)
    if(update){
        const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
        camera.setPosition(newPos)
        scene.updateColors(newPos)
    }
});

document.addEventListener("mouseup", () => {
    scrollbar.handleMouseUp()
});

window.addEventListener('wheel', (event) => {
    camera.updatePosition(event.wheelDeltaY)
    scene.updateColors(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
});


