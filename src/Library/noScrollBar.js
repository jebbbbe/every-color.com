import { constants } from "./constants.js";

export class noScrollBar {
    constructor(start = undefined, parentElement) {
        if(start !== undefined){
            this.scrollPosition = start;
        }else{
            this.scrollPosition = 0;
        }
        this.parent = parentElement || document.body; // Parent container
        
        this.isDragging = false;
        this.startY = 0;
        this.startTop = 0;

        this.clientHeight = this.parent.clientHeight; // Viewable height of the parent
        
        this.scrollbar = document.querySelector(".custom-scrollbar");
        this.thumb = document.querySelector(".scroll-thumb");
        
        this.thumbHeightMin = 20
        this.thumbClampPercent = 0.05//?
        this.thumbHeightMax = 50

        this.thumbHeight = undefined;

        this.scrollMinHeight = 30// minimum height in css..? do we need?
        
        this.updateThumbHeight();
        this.updateActiveHeight();

        this.updateThumbPosition(this.scrollPosition);
    }

    updateThumbHeight() {
        this.thumbHeight = this.thumbClampPercent * this.clientHeight
        this.thumbHeight = Math.max( this.thumbHeightMin, this.thumbHeight)
        this.thumbHeight = Math.min( this.thumbHeightMax, this.thumbHeight)
        this.thumb.style.height = this.thumbHeight + "px";
    }
    updateActiveHeight(){
        this.activeHeight = this.clientHeight - this.thumbHeight;
    }
    updateThumbPosition(newpos = undefined) {
        if (!newpos) {
            this.scrollPosition = 0//this.parent.scrollTop / (this.scrollHeight - this.clientHeight);
        }
        this.thumb.style.top = this.scrollPosition * this.activeHeight + "px";
        return this.scrollPosition;
    }
    setScrollPosition(percentage) {
        this.scrollPosition = Math.min(Math.max(percentage, 0), 1); // Clamp percentage between 0 and 1
        this.updateThumbPosition(this.scrollPosition);
    }

    handleResize() {
        this.clientHeight = this.parent.clientHeight;
        this.updateThumbHeight();
        this.updateActiveHeight()
        this.updateThumbPosition(this.scrollPosition);
    }

    handleScrollbarClick(e) {
        const newTop = Math.min(Math.max(e.clientY, 0), this.activeHeight);
        this.scrollPosition = newTop / this.activeHeight;
        this.updateThumbPosition(this.scrollPosition);
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startY = e.clientY;
        this.startTop = this.activeHeight * this.scrollPosition;
        document.body.style.userSelect = "none"; // Disable text selection
    }
    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaY = e.clientY - this.startY;
            let newTop = this.startTop + deltaY
            newTop = Math.max(newTop, 0)
            newTop = Math.min(newTop,  this.activeHeight)
            this.thumb.style.top = newTop + "px";
            this.scrollPosition = newTop / this.activeHeight;
            return this.scrollPosition;
        }
    }
    handleMouseUp() {
        this.isDragging = false;
        document.body.style.userSelect = ""; // Re-enable text selection
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
