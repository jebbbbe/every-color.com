import { elements,constants,hashTypes,colorBlindTypes,colorFormats,icons } from "/Library/constants.js"
import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { DynamicDropdown } from "/Library/dom/dropdown.js"
import { setupModalEventListeners } from "/Library/dom/modal.js"
import {  inlineSvg, setUpIcons } from "/Library/dom/svg.js"
import {  toggleButton } from "/Library/dom/toggleButton.js"
import { IntervalAnimationController} from "/Library/animationController.js"


window.addEventListener("load", function() {

const scrollFactor = 8
const defaultHash = hashTypes.gradientIV
const defaultColorBlind = colorBlindTypes.none
const defaultColorFormat = colorFormats.hexidecimalString
const camera = new noScrollCamera(scrollFactor, constants.start)
const scene = new htmlScene(defaultHash, defaultColorFormat, camera.visibleIndex)
const scrollbar = new noScrollBar(constants.start/constants.absoluteMax);
const animationController = new IntervalAnimationController(
    renderloop, 
    60
)
requestAnimationFrame(()=>{
    scene.updateHtmlCollection(camera.position)//init
})
window.world = {
    camera:camera,
    scene:scene,
    scrollbar:scrollbar,
}

//dropdowns
const dropdown0 = new DynamicDropdown("hashSelect",hashTypes,hashSelectUpdate, defaultHash)
const dropdown1 = new DynamicDropdown("visionSelect",colorBlindTypes, colorSelectUpdate ,defaultColorBlind)
const dropdown2 = new DynamicDropdown("colorFormat",colorFormats, colorFormatSelectUpdate ,defaultColorFormat)

setupModalEventListeners()
setUpIcons()
console.log(elements)
// buttons
const toggleText = new toggleButton(elements.iconText_hide, { toggleValue: true }, function (state) {
    if (state.toggleValue) {
        inlineSvg(elements.iconText_hide, icons.paths.text_show)
        document.documentElement.style.setProperty("--row-font-size", "0px")
        state.toggleValue = false
    } else {
        inlineSvg(elements.iconText_hide, icons.paths.text_hide)
        document.documentElement.style.removeProperty("--row-font-size")
        state.toggleValue = true
    }
}).addEvent()

const toggleFullscreen = new toggleButton(elements.iconFullscreen, { isFullscreen: false }, function (state) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        let docEl = document.documentElement
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen().then(() => {})
        } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen() // Safari
            state.isFullscreen = true
        }
        state.isFullscreen = true
        inlineSvg(elements.iconFullscreen, icons.paths.fullscreen_exit)
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {})
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen() // Safari
        }
        state.isFullscreen = false
        inlineSvg(elements.iconFullscreen, icons.paths.fullscreen)
    }
    console.log(state)
}).addEvent()
function handleFullscreenChange(e, toggle = toggleFullscreen) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        toggle.state.isFullscreen = false
        inlineSvg(elements.iconFullscreen, icons.paths.fullscreen)
    } else {
        toggle.state.isFullscreen = true
        inlineSvg(elements.iconFullscreen, icons.paths.fullscreen_exit)
    }
    console.log(toggle.state)
}
document.addEventListener("fullscreenchange", handleFullscreenChange)
document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
document.addEventListener("mozfullscreenchange", handleFullscreenChange)
document.addEventListener("MSFullscreenChange", handleFullscreenChange)

const togglePlay = new toggleButton(
    elements.iconPlay,
    {
        isPlaying: false,
        isIncreaseing: true,
        wasResized: false,
    },
    function (state) {
        if (state.isPlaying == false) {
            state.isPlaying = true
            animationController.play()
            inlineSvg(elements.iconPlay, icons.paths.pause)
        } else {
            pausePlay()
        }
    }
).addEvent()
function pausePlay(toggle = togglePlay) {
    toggle.state.isPlaying = false
    animationController.pause()
    inlineSvg(elements.iconPlay, icons.paths.play)
}


function removeLoader() {
    const loader = elements.loader
    loader.style.background = "rgba(255, 255, 255, 0)"
    setTimeout(() => {
        loader.remove()
    }, 1000)
}
function hashSelectUpdate(newVal) {
    scene.setHashFunction(hashTypes[newVal])
    animationController.renderFrame()
}
function colorSelectUpdate(newVal) {
    scene.setColorBlindMode(colorBlindTypes[newVal])
    animationController.renderFrame()
}
function colorFormatSelectUpdate(newVal) {
    scene.setColorFormatMode(colorFormats[newVal])
    animationController.renderFrame()
}

//update Functions
function resize() {
    togglePlay.state.wasResized = true
    animationController.renderFrame()
}
function mouseWheel(e) {
    pausePlay() //pause anim
    camera.updatePosition(e.wheelDeltaY)
    animationController.renderFrame() // what happens when faster than framerate...?
}
function scrollbarMouseDown(e, skip = undefined){
    // console.log("")
    // console.log(skip)
    // console.log(e.pointerType)
    // console.log(e.clientY)
    pausePlay();
    if(e.pointerType == skip){ // skip if mouse on main Elem
        return
    }
    scrollbar.handleMouseDown(e)
    document.addEventListener("pointermove", scrollbarMouseMove);
    document.addEventListener("pointerup", scrollbarMouseUp);
    scrollbar.scrollbar.removeEventListener("click", barClick);//remove while doign this
    function scrollbarMouseMove(e){
        const update = scrollbar.handleMouseMove(e).toFixed(2)//handle small percentages
        if(update){
            const newPos = Math.round( scrollbar.scrollPosition * (constants.absoluteMax - camera.visibleIndex.curr + 1 )) 
            camera.setPosition(newPos)
            animationController.renderFrame()
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
function barClick(e) {
    pausePlay() //pause anim
    scrollbar.handleScrollbarClick(e)
    const newPos = Math.floor(scrollbar.scrollPosition * constants.absoluteMax)
    camera.setPosition(newPos)
    animationController.renderFrame()
    resetWheelEvent()
}

function resetWheelEvent(){
    window.removeEventListener('wheel', mouseWheel);
    window.addEventListener('wheel', mouseWheel);
}
function copyOnPointerUp(e){
    let target = e.target.closest(".colHex"); 
    if (target) {
        const text = target.innerText;
        if(text === "Copied!"){ return; }
        navigator.clipboard.writeText(text);
        target.innerText = "Copied!"
        setTimeout(
            ()=>{target.innerText = text},
            400,
        )
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
elements.main.addEventListener("pointerdown", onPointerDown); // match wheel event instead
elements.main.addEventListener("pointerdown", copyOnPointerUp) // copy contents







window.addEventListener("keydown", (e) => {
    let pos = camera.position
    switch (e.key) {
        case "ArrowUp":
            pos = camera.position - 1
            break
        case "PageUp":
            pos = camera.position - camera.visibleIndex.curr + 1
            break
        case "Home":
            pos = constants.absoluteMin
            break
        case "ArrowDown":
            pos = camera.position + 1
            break
        case "PageDown":
            pos = camera.position + camera.visibleIndex.curr - 1
            break
        case "End":
            pos = constants.absoluteMax
            break
        case "F11":
            e.preventDefault()
            toggleFullscreen.fn()
            break
        default:
            return
    }
    pausePlay()
    camera.setPosition(pos)
    animationController.renderFrame()
})  

function onPointerDown(e) {
    if (e.pointerType == "mouse") return; // not on desktop
    pausePlay()
    let lastY = e.clientY;
    let velocityY = 0;
    let activePointerId = e.pointerId;
    let momentumFrame;
    const friction = 0.90;

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




function renderloop(time, playState = togglePlay.state) {
    // if playing increment camera.position
    if (playState.isPlaying) {
        let position = camera.position
        let rowCount = camera.visibleIndex.curr
        if (position == constants.absoluteMin) {
            playState.isIncreaseing = true
        } else if (position + rowCount - 1 >= constants.absoluteMax) {
            playState.isIncreaseing = false
        }
        if (playState.isIncreaseing) {
            position++
        } else {
            position--
        }
        camera.setPosition(position)
    }
    if (playState.wasResized) {
        camera.resize()
        scrollbar.handleResize()
        playState.wasResized = false
    }
    scrollbar.setScrollPosition(camera.position / constants.absoluteMax)
    scene.updateHtmlCollection(camera.position)
}




removeLoader() // remove after all setup is done
});