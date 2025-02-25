import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { constants,hashTypes,colorBlindTypes,colorFormats } from "/Library/constants.js"
import { DynamicDropdown } from "/Library/dom/dropdown.js"
import { setupModalEventListeners } from "/Library/dom/modal.js"

const mainClass = "row-holder"
const rowClass = "row-thing"
const scrollFactor = 8
const defaultHash = hashTypes.gradientIV
const defaultColorBlind = colorBlindTypes.none
const defaultColorFormat = colorFormats.hexidecimalString
const camera = new noScrollCamera(mainClass,rowClass,scrollFactor,constants.start)
const scene = new htmlScene(mainClass,defaultHash,defaultColorFormat)
const scrollbar = new noScrollBar(constants.start/constants.absoluteMax);
const mainElem = document.getElementById(mainClass)
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
removeLoader()


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
    camera.updatePosition(e.wheelDeltaY)
    scene.updateHtmlCollection(camera.position)
    scrollbar.setScrollPosition( camera.position/constants.absoluteMax)
}


function scrollbarMouseDown(e, skip = undefined){
    console.log("")
    console.log(skip)
    console.log(e.pointerType)
    console.log(e.clientY)
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
// mainElem.addEventListener("pointerdown", e => scrollbarMouseDown(e,"mouse")); // match wheel event instead
// scrollbar.thumb.addEventListener("touchstart", scrollbarTouchStart);// needs to be added to the body???
mainElem.addEventListener("pointerup", copyOnPointerUp)


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