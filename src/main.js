import { elements, constants, hashTypes, visionTypes, colorFormats, icons } from "/Library/constants.js"
import { noScrollCamera } from "/Library/noScrollCamera.js"
import { noScrollBar } from "/Library/noScrollBar.js"
import { htmlScene } from "/Library/htmlScene.js"
import { DynamicDropdown } from "/Library/dom/dropdown.js"
import { setupModalEventListeners } from "/Library/dom/modal.js"
import { inlineSvg, requestAllIcons } from "/Library/dom/svg.js"
import { toggleButton } from "/Library/dom/toggleButton.js"
import { IntervalAnimationController } from "/Library/animationController.js"

// import {getSafeOpposite} from "/Library/color/safeOpposite.js"
// getSafeOpposite(0x000000)
// getSafeOpposite(0x3f3f3f)
// getSafeOpposite(0x7f7f7f)
// getSafeOpposite(0xbfbfbf)
// getSafeOpposite(0xffffff)
// ee

const iconsLoaded = requestAllIcons()
window.addEventListener("load", async function () {
    await iconsLoaded

    const scrollFactor = 8
    const defaultHash = hashTypes.gradientIV
    const defaultVision = visionTypes.none
    const defaultColorFormat = colorFormats.hexidecimalString
    const camera = new noScrollCamera(scrollFactor, constants.start)
    const scene = new htmlScene(defaultHash, defaultColorFormat, camera.visibleIndex)
    const scrollbar = new noScrollBar(constants.start / constants.absoluteMax)
    const animationController = new IntervalAnimationController(renderloop, 60)
    requestAnimationFrame(() => {
        scene.updateHtmlCollection(camera.position) //init
    })
    window.world = {
        camera: camera,
        scene: scene,
        scrollbar: scrollbar,
        icons: icons,
        elements,
    }

    // Buttons
    const toggleText = new toggleButton(elements.iconText_hide, { toggleValue: true }, function (state) {
        if (state.toggleValue) {
            inlineSvg(elements.iconText_hide, icons.content.text_show)
            document.documentElement.style.setProperty("--row-font-size", "0px")
            state.toggleValue = false
        } else {
            inlineSvg(elements.iconText_hide, icons.content.text_hide)
            document.documentElement.style.removeProperty("--row-font-size")
            state.toggleValue = true
        }
        blurCurrentElement()
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
            inlineSvg(elements.iconFullscreen, icons.content.fullscreen_exit)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {})
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen() // Safari
            }
            state.isFullscreen = false
            inlineSvg(elements.iconFullscreen, icons.content.fullscreen)
        }
        blurCurrentElement()
    }).addEvent()
    const togglePlay = new toggleButton(elements.iconPlay, { isPlaying: false, isIncreaseing: true, wasResized: false, wakeLock:null }, async function (state) {
        if (state.isPlaying == false) {
            state.isPlaying = true
            animationController.play()
            inlineSvg(elements.iconPlay, icons.content.pause)
            try {
                state.wakeLock = await navigator.wakeLock.request("screen");
                // listen for our release event
                state.wakeLock.addEventListener("release", () => {
                    // if wake lock is released alter the UI accordingly
                    state.wakeLock = null
                });
            } catch (err) {
                // if wake lock request fails - usually system related, such as battery
                state.wakeLock = null
            }
        } else {
            pausePlay()
        }
        blurCurrentElement()
    }).addEvent()
    for (const button of [elements.iconDescription, elements.iconCode]) {
        button.addEventListener("click", function () {
            const href = button.dataset.href
            if (href) {
                window.open(href, "_blank", "noopener,noreferrer")
            }
            blurCurrentElement()
        })
    }
    window.togglePlay = togglePlay
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)
    function handleFullscreenChange(e, toggle = toggleFullscreen) {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            toggle.state.isFullscreen = false
            inlineSvg(elements.iconFullscreen, icons.content.fullscreen)
        } else {
            toggle.state.isFullscreen = true
            inlineSvg(elements.iconFullscreen, icons.content.fullscreen_exit)
        }
    }
    function pausePlay(toggle = togglePlay) {
        toggle.state.isPlaying = false
        animationController.pause()
        inlineSvg(elements.iconPlay, icons.content.play)
        if (toggle.state.wakeLock !== null) {
            toggle.state.wakeLock.release().then(() => {
                toggle.state.wakeLock = null;
            });
        }
    }

    //dropdowns
    setupModalEventListeners()
    const dropdown0 = new DynamicDropdown("hashSelect", hashTypes, hashSelectUpdate, defaultHash)
    const dropdown1 = new DynamicDropdown("visionSelect", visionTypes, colorSelectUpdate, defaultVision)
    const dropdown2 = new DynamicDropdown("colorFormat", colorFormats, colorFormatSelectUpdate, defaultColorFormat)
    function hashSelectUpdate(newVal) {
        scene.setHashFunction(hashTypes[newVal])
        animationController.renderFrame()
    }
    function colorSelectUpdate(newVal) {
        scene.setvisionMode(visionTypes[newVal])
        animationController.renderFrame()
    }
    function colorFormatSelectUpdate(newVal) {
        scene.setColorFormatMode(colorFormats[newVal])
        animationController.renderFrame()
    }

    // Event listeners
    window.addEventListener("resize", resize)
    window.addEventListener("wheel", mouseWheel)
    window.addEventListener("keydown", keyboardInteration)
    scrollbar.scrollbar.addEventListener("click", barClick)
    scrollbar.thumb.addEventListener("pointerdown", scrollbarMouseDown)
    elements.main.addEventListener("pointerdown", mobileScroll) // match wheel event instead
    elements.main.addEventListener("pointerdown", copyOnPointerUp) // copy contents
    function resize() {
        togglePlay.state.wasResized = true
        animationController.renderFrame()
    }
    function mouseWheel(e) {
        pausePlay() //pause anim
        camera.updatePosition(e.wheelDeltaY)
        animationController.renderFrame() // what happens when faster than framerate...?
    }
    function keyboardInteration(e) {
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
    }
    function barClick(e) {
        pausePlay() //pause anim
        scrollbar.handleScrollbarClick(e)
        const newPos = Math.floor(scrollbar.scrollPosition * constants.absoluteMax)
        camera.setPosition(newPos)
        animationController.renderFrame()
        resetWheelEvent()
    }
    function scrollbarMouseDown(e) {
        pausePlay()
        scrollbar.handleMouseDown(e)
        document.addEventListener("pointermove", scrollbarMouseMove)
        document.addEventListener("pointerup", scrollbarMouseUp)
        scrollbar.scrollbar.removeEventListener("click", barClick) //remove while doign this
        function scrollbarMouseMove(e) {
            const update = scrollbar.handleMouseMove(e).toFixed(2) //handle small percentages
            if (update) {
                const newPos = Math.round(scrollbar.scrollPosition * (constants.absoluteMax - camera.visibleIndex.curr + 1))
                camera.setPosition(newPos)
                animationController.renderFrame()
            }
        }
        function scrollbarMouseUp() {
            scrollbar.handleMouseUp()
            document.removeEventListener("pointermove", scrollbarMouseMove)
            document.removeEventListener("pointerup", scrollbarMouseUp)
            setTimeout(() => {
                scrollbar.scrollbar.addEventListener("click", barClick)
                resetWheelEvent()
            }, 0)
        }
    }
    function resetWheelEvent() {
        window.removeEventListener("wheel", mouseWheel)
        window.addEventListener("wheel", mouseWheel)
    }
    function mobileScroll(e) {
        if (e.pointerType == "mouse") return // not on desktop
        pausePlay()
        let lastY = e.clientY
        let velocityY = 0
        let activePointerId = e.pointerId
        let momentumFrame
        const friction = 0.9

        cancelMomentum() // Stop existing momentum on new touch
        document.addEventListener("pointermove", onPointerMove)
        document.addEventListener("pointerup", onPointerUp)
        document.addEventListener("pointercancel", onPointerUp)

        function onPointerMove(e) {
            if (e.pointerId !== activePointerId) return

            let currentY = e.clientY
            let deltaY = currentY - lastY
            lastY = currentY

            velocityY = deltaY
            mouseWheel({ wheelDeltaY: deltaY })
        }
        function onPointerUp(e) {
            if (e.pointerId !== activePointerId) return

            document.removeEventListener("pointermove", onPointerMove)
            document.removeEventListener("pointerup", onPointerUp)
            document.removeEventListener("pointercancel", onPointerUp)

            applyMomentum()
        }
        function applyMomentum() {
            if (Math.abs(velocityY) < 0.1) return

            mouseWheel({ wheelDeltaY: velocityY })
            velocityY *= friction
            momentumFrame = requestAnimationFrame(applyMomentum)
        }
        function cancelMomentum() {
            if (momentumFrame) {
                cancelAnimationFrame(momentumFrame)
                momentumFrame = null
            }
        }
    }
    function copyOnPointerUp(e) {
        let target = e.target.closest(".colHex")
        if (target) {
            const text = target.innerText
            if (text === "Copied!") {
                return
            }
            navigator.clipboard.writeText(text)
            target.innerText = "Copied!"
            setTimeout(() => {
                target.innerText = text
            }, 400)
        }
        // remove focus from elem to remove color
        blurCurrentElement()
    }
    function blurCurrentElement(){
        const focusedElement = document.activeElement
        if (focusedElement) {
            focusedElement.blur()
        }
    }

    // remove after all setup is done
    removeLoader()
    function removeLoader() {
        const loader = elements.loader
        loader.style.background = "rgba(255, 255, 255, 0)"
        loader.style.zIndex = -10
        setTimeout(() => {
            loader.remove()
        }, 1000)
    }
    //render loop
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
})
