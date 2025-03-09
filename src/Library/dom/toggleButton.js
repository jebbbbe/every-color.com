class toggleButton {
    constructor(start = false, elem, event, onToggle) {
        this.toggleValue = start
        this.elem = elem
        this.event = event
        this.fn = function () {
            onToggle(this.toggleValue)
        }
    }
    fn() { }//stub
    toggle() {
        this.toggleValue != this.toggleValue
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
        this.elem.addEventListener(this.event, this.fn)
    }
}