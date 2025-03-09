export class AnimationController {
    constructor(renderFunction) {
        this.render = renderFunction
        this.animateLoop
    }
    pause() {
        this.animateLoop = false
    }
    play() {
        this.animateLoop = true
        this.animate()
    }
    animate() {
        this.render();
        if (this.animateLoop) { // request next frame unless we exit
            requestAnimationFrame(this.animate);
        }
    }
    render() { }
    renderFrame() { // f we arent in an animation loop run render frame once 
        if(!this.animateLoop){
            requestAnimationFrame(this.render);
        }
    }

}
export class IntervalAnimationController extends AnimationController {
    constructor(renderFunction, interval) {
        super(renderFunction)
        this.lastTime = 0
        this.interval = interval
    }
    animate(currentTime = 0) { 
        if (currentTime - this.lastTime > this.interval) { // only do update logic to match the interval
            this.lastTime = currentTime - (currentTime % interval);
            render();
        }
        if (animateLoop) { // request next frame unless we exit
            requestAnimationFrame(this.animate);
        }
    }

}
export class FPSAnimationController extends IntervalAnimationController {
    constructor(renderFunction, fps) {
        super(renderFunction, 1000 / fps) // convert fps to interval
    }
}