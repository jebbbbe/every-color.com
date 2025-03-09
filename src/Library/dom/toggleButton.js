export class toggleButton {
    constructor(elem, state = {toggleValue:false}, onToggle, event = "pointerdown") {
        this.state = state
        this.elem = elem
        this.event = event
        this.fn = (e) => {
            onToggle(this.state, this, e)
        }
    }
    fn() { }//stub
    toggle() {
        this.toggleValue = !this.toggleValue
    }
    turnOn() {
        this.toggleValue = true
    }
    turnOff() {
        this.toggleValue = false
    }
    addEvent() {
        this.elem.addEventListener(this.event, this.fn)
    }
    removeEvent() {
        this.elem.removeEventListener(this.event, this.fn)
    }
}