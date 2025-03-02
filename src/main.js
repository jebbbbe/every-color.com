import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { constants,hashTypes,colorBlindTypes,colorFormats,icons } from "/Library/constants.js"
import { DynamicDropdown } from "/Library/dom/dropdown.js"
import { setupModalEventListeners } from "/Library/dom/modal.js"
import { toggleFullscreen } from "/Library/dom/fullscreen.js"
import { togglePlay, pausePlay } from "/Library/dom/playbutton.js"
import {  inlineSvg, setUpIcons } from "/Library/dom/svg.js"


window.addEventListener("load", function() {



const mainClass = "row-holder"
const rowClass = "row-thing"
const scrollFactor = 8
const defaultHash = hashTypes.gradientIV
const defaultColorBlind = colorBlindTypes.none
const defaultColorFormat = colorFormats.hexidecimalString
const mainElem = document.getElementById(mainClass)
const fullscreen = document.getElementById("fullscreen-button")
const play = document.getElementById("play-button")
const camera = new noScrollCamera(mainClass,rowClass,scrollFactor,constants.start)
const scene = new htmlScene(mainClass,defaultHash,defaultColorFormat)
const scrollbar = new noScrollBar(constants.start/constants.absoluteMax);
window.world = {
    camera:camera,
    scene:scene,
    scrollbar:scrollbar,
}

camera.resize()
scene.updateHtmlCollection(camera.position)
const dropdown0 = new DynamicDropdown("hashSelect",hashTypes,hashSelectUpdate, defaultHash)
const dropdown1 = new DynamicDropdown("colorBlindSelect",colorBlindTypes, colorSelectUpdate ,defaultColorBlind)
const dropdown2 = new DynamicDropdown("colorFormat",colorFormats, colorFormatSelectUpdate ,defaultColorFormat)
setupModalEventListeners()

// setPropertOnObjectFromParent(play)
setUpIcons()
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
    scene.updateHtmlCollection(camera.position)
}
function colorSelectUpdate(newVal){
    scene.setColorBlindMode(colorBlindTypes[newVal])
    scene.updateHtmlCollection(camera.position)
}
function colorFormatSelectUpdate(newVal){
    scene.setColorFormatMode(colorFormats[newVal])
    scene.updateHtmlCollection(camera.position)
}

//update Functions
function resize(){
    camera.resize()
    scrollbar.handleResize()
    scene.updateHtmlCollection(camera.position)
}
function mouseWheel(e){
    pausePlay()//pause anim
    camera.updatePosition(e.wheelDeltaY)
    scene.updateHtmlCollection(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}


function scrollbarMouseDown(e, skip = undefined){
    // console.log("")
    // console.log(skip)
    // console.log(e.pointerType)
    // console.log(e.clientY)
    pausePlay();
    if(e.pointerType == skip){ // skip if mouse on mainElem
        return
    }
    scrollbar.handleMouseDown(e)
    document.addEventListener("pointermove", scrollbarMouseMove);
    document.addEventListener("pointerup", scrollbarMouseUp);
    scrollbar.scrollbar.removeEventListener("click", barClick);//remove while doign this
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e).toFixed(2)//handle small percentages
        if(update){
            const newPos = Math.round( scrollbar.scrollPosition * (constants.absoluteMax - camera.rowCount + 1 )) 
            camera.setPosition(newPos)
            scene.updateHtmlCollection(newPos)
        }
    }
    function scrollbarMouseUp(){
        scrollbar.handleMouseUp()
        document.removeEventListener("pointermove", scrollbarMouseMove);
        document.removeEventListener("pointerup", scrollbarMouseUp);
        setTimeout(() => {
            scrollbar.scrollbar.addEventListener("click", barClick);
            resetWheelEvent()
        }, 0);
    }
}
function scrollbarTouchStart(e){
    console.log("e",e)
    console.log("clientY",e.clientY)
    scrollbar.handleMouseDown(e)
    document.addEventListener("touchmove", scrollbarMouseMove);
    document.addEventListener("touchend", scrollbarMouseUp);
    scrollbar.scrollbar.removeEventListener("click", barClick);//remove while doign this
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e).toFixed(2)//handle small percentages
        if(update){
            const newPos = Math.round( scrollbar.scrollPosition * (constants.absoluteMax - camera.rowCount + 1 )) 
            camera.setPosition(newPos)
            scene.updateHtmlCollection(newPos)
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
    pausePlay();//pause anim
    scrollbar.handleScrollbarClick(e)
    const newPos = Math.floor( scrollbar.scrollPosition * constants.absoluteMax ) 
    camera.setPosition(newPos)
    scene.updateHtmlCollection(newPos)
    resetWheelEvent()
}

function syncSetPosition(pos){
    camera.setPosition(pos)
    scene.updateHtmlCollection(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}

function resetWheelEvent(){
    window.removeEventListener('wheel', mouseWheel);
    window.addEventListener('wheel', mouseWheel);
}
function copyOnPointerUp(e){
    let target = e.target.closest(".colHex"); 
    if (target) {
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {});
    }
    // remove focus from elem to remove color
    const focusedElement = document.activeElement;
    if (focusedElement) {
        focusedElement.blur();
    }
}
// Event listeners
window.addEventListener("resize", resize);
window.addEventListener('wheel', mouseWheel)
scrollbar.scrollbar.addEventListener("click", barClick);
scrollbar.thumb.addEventListener("pointerdown", scrollbarMouseDown);
mainElem.addEventListener("pointerdown", onPointerDown); // match wheel event instead
mainElem.addEventListener("pointerdown", copyOnPointerUp) // copy contents
fullscreen.addEventListener("pointerdown", e=> toggleFullscreen() )
play.addEventListener("pointerdown", e=> {
    togglePlay(camera.position, camera.rowCount, syncSetPosition)
})
let hideText = true;
icons.elements.text_hide.addEventListener("pointerdown", e=>{
    console.log("add text hide function")
    if(hideText){
        inlineSvg(icons.elements.text_hide, icons.paths.text_show)
        hideText = false
    }else{
        inlineSvg(icons.elements.text_hide, icons.paths.text_hide)
        hideText = true
    }
})

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

function onPointerDown(e) {
    // console.log(e.pointerType)
    if (e.pointerType == "mouse") return; // not on desktop
    let lastY = e.clientY;
    let velocityY = 0;
    let activePointerId = e.pointerId;
    let momentumFrame;
    const friction = 0.95;

    cancelMomentum(); // Stop existing momentum on new touch
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    function onPointerMove(e) {
        if (e.pointerId !== activePointerId) return;

        let currentY = e.clientY;
        let deltaY = currentY - lastY;
        lastY = currentY;

        velocityY = deltaY;
        mouseWheel({ wheelDeltaY: deltaY });
    }
    function onPointerUp(e) {
        if (e.pointerId !== activePointerId) return;

        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.removeEventListener("pointercancel", onPointerUp);

        applyMomentum();
    }
    function applyMomentum() {
        if (Math.abs(velocityY) < 0.1) return;

        mouseWheel({ wheelDeltaY: velocityY });
        velocityY *= friction;
        momentumFrame = requestAnimationFrame(applyMomentum);
    }
    function cancelMomentum() {
        if (momentumFrame) {
            cancelAnimationFrame(momentumFrame);
            momentumFrame = null;
        }
    }
}

// SETTINGS

function openModal() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        closeModal();
    }
}

function saveSettings() {
    let username = document.getElementById('username').value;
    let theme = document.getElementById('theme').value;
    alert('Settings Saved:\nUsername: ' + username + '\nTheme: ' + theme);
    closeModal();
}


removeLoader() // remove after all setup is done
});
