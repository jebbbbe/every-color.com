export class AnimationController {
    constructor(renderFunction = () => {}) {
        if (typeof renderFunction !== "function") {
            console.error(`renderer:${renderFunction} is not a function`)
            return
        }
        this.render = renderFunction
        this.animateLoop = false
        this.animate = this.animate.bind(this)
    }
    pause() {
        this.animateLoop = false
    }
    play() {
        this.animateLoop = true
        this.animate()
    }
    render(currentTime) {}
    setRenderer(fn) {
        if (typeof fn !== "function") return
        this.render = fn
    }
    animate(currentTime = 0) {
        this.render()
        // request next frame unless we exit
        if (this.animateLoop) {
            requestAnimationFrame(this.animate)
        }
    }
    renderFrame() {
        // add a debounce ? requestAnimationFrame kinda does this on its own per frame...
        // if we arent in an animation loop run render frame once
        if (!this.animateLoop) {
            requestAnimationFrame(this.render)
        }
    }
}
export class IntervalAnimationController extends AnimationController {
    constructor(renderFunction, interval) {
        if (typeof interval !== "number") {
            console.error(`interval:${interval} is not a number`)
            return
        }
        super(renderFunction)
        this.lastTime = 0
        this.interval = interval
        this.animate = this.animate.bind(this)
    }
    animate(currentTime = 0) {
        // only do update logic to match the interval
        if (currentTime - this.lastTime > this.interval) {
            this.lastTime = currentTime - (currentTime % this.interval)
            this.render()
        }
        // request next frame unless we exit
        if (this.animateLoop) {
            requestAnimationFrame(this.animate)
        }
    }
}
export class FPSAnimationController extends IntervalAnimationController {
    constructor(renderFunction, fps) {
        super(renderFunction, 1000 / fps) // convert fps to interval
    }
}
