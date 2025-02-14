import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { constants,hashTypes,colorBlindTypes } from "/Library/constants.js"
import { DynamicDropdown } from "/Library/dropdown.js"


const mainClass = "row-holder"
const rowClass = "row-thing"
const scrollFactor = 8
const defaultHash = hashTypes.gradientI
const defaultColorBlind = colorBlindTypes.none
const camera = new noScrollCamera(mainClass,rowClass,scrollFactor,constants.start)
const scene = new htmlScene(mainClass,defaultHash)
const scrollbar = new noScrollBar(constants.start/constants.absoluteMax);
window.scrollbar = scrollbar

camera.resize()
scene.updateColors(camera.position)
removeLoader()
const dropdown0 = new DynamicDropdown("hashSelect",hashTypes,hashSelectUpdate,defaultHash)
const dropdown1 = new DynamicDropdown("colorBlindSelect",colorBlindTypes, colorSelectUpdate   ,defaultColorBlind)

function logg(v){
    console.log(v)
}


//setupfunctions
function removeLoader(){
    const loader = document.querySelector(".loader")
    loader.style.background = "rgba(255, 255, 255, 0)";
    setTimeout(() => {
        loader.remove();
    }, 1000); // 1000 milliseconds = 1 second
}
function hashSelectUpdate(newVal){
    scene.setHashFunction(hashTypes[newVal])
    scene.updateColors(camera.position)
}
function colorSelectUpdate(newVal){
    scene.setColorBlindMode(colorBlindTypes[newVal])
    scene.updateColors(camera.position)
}

//update Functions
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
    scrollbar.scrollbar.removeEventListener("click", barClick);//remove while doign this
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e).toFixed(2)//handle small percentages
        if(update){
            const newPos = Math.round( scrollbar.scrollPosition * (constants.absoluteMax - camera.rowCount + 1 )) 
            camera.setPosition(newPos)
            scene.updateColors(newPos)
        }
    }
    function scrollbarMouseUp(){
        scrollbar.handleMouseUp()
        document.removeEventListener("mousemove", scrollbarMouseMove);
        document.removeEventListener("mouseup", scrollbarMouseUp);
        setTimeout(() => {
            scrollbar.scrollbar.addEventListener("click", barClick);
            resetWheelEvent()
        }, 0);
    }
}
function scrollbarTouchStart(e){
    scrollbar.handleMouseDown(e)
    document.addEventListener("touchmove", scrollbarMouseMove);
    document.addEventListener("touchend", scrollbarMouseUp);
    scrollbar.scrollbar.removeEventListener("click", barClick);//remove while doign this
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e).toFixed(2)//handle small percentages
        if(update){
            const newPos = Math.round( scrollbar.scrollPosition * (constants.absoluteMax - camera.rowCount + 1 )) 
            camera.setPosition(newPos)
            scene.updateColors(newPos)
        }
    }
    function scrollbarMouseUp(){
        scrollbar.handleMouseUp()
        document.removeEventListener("touchmove", scrollbarMouseMove);
        document.removeEventListener("touchend", scrollbarMouseUp);
        setTimeout(() => {
            scrollbar.scrollbar.addEventListener("click", barClick);
            resetWheelEvent()
        }, 0);
    }
}
function barClick(e){
    scrollbar.handleScrollbarClick(e)
    const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
    camera.setPosition(newPos)
    scene.updateColors(newPos)
    resetWheelEvent()
}

function syncSetPosition(pos){
    camera.setPosition(pos)
    scene.updateColors(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}

function resetWheelEvent(){
    window.removeEventListener('wheel', mouseWheel);
    window.addEventListener('wheel', mouseWheel);
}

// Event listeners
window.addEventListener("resize", resize);
window.addEventListener('wheel', e => mouseWheel(e))
scrollbar.scrollbar.addEventListener("click", barClick);
scrollbar.thumb.addEventListener("mousedown", scrollbarMouseDown);
// scrollbar.thumb.addEventListener("touchstart", scrollbarTouchStart);// need sto be added to the body???s
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
            pos = constants.absoluteMax
            break
        default:
            return;
    }
    syncSetPosition(pos)
})  



