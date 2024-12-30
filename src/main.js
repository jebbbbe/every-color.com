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
removeLoader()

function removeLoader(){
    const loader = document.querySelector(".loader")
    loader.style.background = "rgba(255, 255, 255, 0)";
    setTimeout(() => {
        loader.remove();
    }, 1000); // 1000 milliseconds = 1 second
}



function resize(){
    camera.resize()
    scrollbar.handleResize()
    scene.updateColors(camera.position)
}
function mouseWheel(e){
    camera.updatePosition(e.wheelDeltaY)
    scene.updateColors(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}
function scrollbarMouseDown(e){
    scrollbar.handleMouseDown(e)
    document.addEventListener("mousemove", scrollbarMouseMove);
    document.addEventListener("mouseup", scrollbarMouseUp);
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e)
        if(update){
            const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
            camera.setPosition(newPos)
            scene.updateColors(newPos)
        }
    }
    function scrollbarMouseUp(){
        scrollbar.handleMouseUp()
        document.removeEventListener("mousemove", scrollbarMouseMove);
        document.removeEventListener("mouseup", scrollbarMouseUp);
    }
}
function scrollbarTouchStart(e){
    scrollbar.handleMouseDown(e)
    document.addEventListener("touchmove", scrollbarMouseMove);
    document.addEventListener("touchend", scrollbarMouseUp);
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e)
        if(update){
            const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
            camera.setPosition(newPos)
            scene.updateColors(newPos)
        }
    }
    function scrollbarMouseUp(){
        scrollbar.handleMouseUp()
        document.removeEventListener("touchmove", scrollbarMouseMove);
        document.removeEventListener("touchend", scrollbarMouseUp);
    }
}

function syncSetPosition(pos){
    camera.setPosition(pos)
    scene.updateColors(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}

// Event listeners
window.addEventListener("resize", resize);
window.addEventListener('wheel', e => mouseWheel(e))
scrollbar.thumb.addEventListener("mousedown", scrollbarMouseDown);
scrollbar.thumb.addEventListener("touchstart", scrollbarTouchStart);// need sto be added to the body???s
window.addEventListener('keydown', e => {
    let pos = undefined
    switch(e.key){
        case "ArrowUp":
            pos = camera.position - 1
            break
        case "PageUp":
            pos = camera.position - camera.rowCount + 1
            break
        case "Home":
            pos = constants.absoluteMin
            break
        case "ArrowDown":
            pos = camera.position + 1
            break
        case "PageDown":
            pos = camera.position + camera.rowCount - 1
            break
        case "End":
            console.error("not implement corectly...")
            pos = constants.absoluteMax
            break
        default:
            return;
    }
    syncSetPosition(pos)
})  





scrollbar.scrollbar.addEventListener("click", (e) => {
    scrollbar.handleScrollbarClick(e)
    const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
    camera.setPosition(newPos)
    scene.updateColors(newPos)
});

