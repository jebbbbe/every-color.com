import { constants } from "./constants.js";

export class noScrollBar {
    constructor(parentElement) {
        this.parent = parentElement || document.body; // Parent container
        this.scrollbar = null;
        this.thumb = null;

        this.isDragging = false;
        this.startY = 0;
        this.startTop = 0;
        this.scrollPosition = 0;

        this.contentHeight = document.body.scrollHeight - window.innerHeight;
        this.scrollHeight = this.parent.scrollHeight; // Content height inside the parent
        this.clientHeight = this.parent.clientHeight; // Viewable height of the parent
        
        this.scrollbar = document.querySelector(".custom-scrollbar");
        this.thumb = document.querySelector(".scroll-thumb");
        
        this.updateThumbHeight();
        this.updateThumbPosition();
    }
    updateThumbHeight() {
        const thumbHeight = Math.min(Math.max((window.innerHeight / document.body.scrollHeight) * window.innerHeight, 10), 50);
        this.thumb.style.height = thumbHeight + "px";
    }
    handleResize() {
        this.contentHeight = document.body.scrollHeight - window.innerHeight;
        this.updateThumbHeight();
        this.updateThumbPosition();
    }
    updateThumbPosition(newpos = undefined) {
        if (!newpos) {
            this.scrollPosition = window.scrollY / this.contentHeight;
        }
        this.thumb.style.top = this.scrollPosition * (window.innerHeight - this.thumb.offsetHeight) + "px";
        // console.log(this.scrollPosition.toFixed(2)); // Log the scroll percentage (0 to 1)
        return this.scrollPosition;
    }

    handleScroll(e) {
        const deltaY = e.deltaY;
        const newScrollY = Math.min(Math.max(window.scrollY + deltaY, 0), this.contentHeight);
        this.updateThumbPosition();
    }
    handleMouseDown(e) {
        this.isDragging = true;
        this.startY = e.clientY;
        this.startTop = parseInt(window.getComputedStyle(this.thumb).top, 10);
        document.body.style.userSelect = "none"; // Disable text selection
    }
    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaY = e.clientY - this.startY;
            const newTop = Math.min(Math.max(this.startTop + deltaY, 0), window.innerHeight - this.thumb.offsetHeight);
            this.thumb.style.top = newTop + "px";
            this.scrollPosition = newTop / (window.innerHeight - this.thumb.offsetHeight);
            // console.log(this.scrollPosition.toFixed(2)); // Log the scroll percentage (0 to 1)
            return this.scrollPosition;
        }
    }
    handleMouseUp() {
        this.isDragging = false;
        document.body.style.userSelect = ""; // Re-enable text selection
    }
    setScrollPosition(percentage) {
        this.scrollPosition = Math.min(Math.max(percentage, 0), 1); // Clamp percentage between 0 and 1
        // console.log(this.scrollPosition)
        this.updateThumbPosition(this.scrollPosition);
    }
}

// use
/*
let scrollbar = new noScrollBar()
window.addEventListener("resize", () => {
    scrollbar.handleResize()
});

scrollbar.thumb.addEventListener("mousedown", (e) => {
    scrollbar.handleMouseDown(e)
});

document.addEventListener("mousemove", (e) => {
    const update = scrollbar.handleMouseMove(e)
});

document.addEventListener("mouseup", () => {
    scrollbar.handleMouseUp()
});

window.addEventListener('wheel', (event) => {
    const result = calcUpdate()
    scrollbar.setScrollPosition( result )
});
*/
