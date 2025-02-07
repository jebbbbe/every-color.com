import { constants } from "./constants.js";

export class noScrollBar {
    constructor(start = undefined, parentElement) {
        console.warn("start not implemented")

        this.parent = parentElement || document.body; // Parent container
        
        this.isDragging = false;
        this.startY = 0;
        this.startTop = 0;
        this.scrollPosition = 0;

        // this.contentHeight = document.body.scrollHeight - window.innerHeight;
        this.scrollHeight = this.parent.scrollHeight; // Content height inside the parent
        this.clientHeight = this.parent.clientHeight; // Viewable height of the parent
        
        this.scrollbar = document.querySelector(".custom-scrollbar");
        this.thumb = document.querySelector(".scroll-thumb");
        
        this.thumbHeightMin = 10
        this.thumbHeightMax = 50
        this.thumbHeight = undefined;

        console.log("")
        console.log(this.parent)
        console.log(this.scrollHeight)
        console.log(this.clientHeight)
        this.updateThumbHeight();
        this.updateThumbPosition();
    }
    updateThumbHeight() {
        this.thumbHeight = Math.min(
            Math.max((this.clientHeight / this.scrollHeight) * this.clientHeight, this.thumbHeightMin),
            this.thumbHeightMax
        );

        this.thumb.style.height = this.thumbHeight + "px";
    }
    handleResize() {
        // this.contentHeight = document.body.scrollHeight - window.innerHeight;
        this.scrollHeight = this.parent.scrollHeight;
        this.clientHeight = this.parent.clientHeight;
        this.updateThumbHeight();
        this.updateThumbPosition();
    }
    updateThumbPosition(newpos = undefined) {
        if (!newpos) {
            this.scrollPosition = this.parent.scrollTop / (this.scrollHeight - this.clientHeight);
        }
        const maxThumbTop = this.clientHeight - this.thumb.offsetHeight;
        this.thumb.style.top = this.scrollPosition * maxThumbTop + "px";
        // console.log(this.scrollPosition.toFixed(2)); // Log the scroll percentage (0 to 1)
        return this.scrollPosition;
    }

    handleScroll(e) {
        const deltaY = e.deltaY;
        const newScrollTop = Math.min(
            Math.max(this.parent.scrollTop + deltaY, 0),
            this.scrollHeight - this.clientHeight
        );
        this.parent.scrollTop = newScrollTop;
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
            const maxThumbTop = this.clientHeight - this.thumb.offsetHeight;
            const newTop = Math.min(Math.max(this.startTop + deltaY, 0), maxThumbTop);
            this.thumb.style.top = newTop + "px";
            this.scrollPosition = newTop / maxThumbTop;
            this.parent.scrollTop = this.scrollPosition * (this.scrollHeight - this.clientHeight);
            return this.scrollPosition;
        }
    }
    handleMouseUp() {
        this.isDragging = false;
        document.body.style.userSelect = ""; // Re-enable text selection
    }
    setScrollPosition(percentage) {
        this.scrollPosition = Math.min(Math.max(percentage, 0), 1); // Clamp percentage between 0 and 1
        this.parent.scrollTop = this.scrollPosition * (this.scrollHeight - this.clientHeight);
        this.updateThumbPosition(this.scrollPosition);
    }
    handleScrollbarClick(e) {
        console.log("click")
        const rect = this.scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top; // Click position relative to the scrollbar
        const maxThumbTop = this.clientHeight - this.thumb.offsetHeight;

        // Calculate new scroll position based on click
        const newTop = Math.min(Math.max(clickY, 0), maxThumbTop);
        this.scrollPosition = newTop / maxThumbTop;
        this.parent.scrollTop = this.scrollPosition * (this.scrollHeight - this.clientHeight);
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
