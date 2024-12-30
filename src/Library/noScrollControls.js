export class noScrollControls {
  constructor() {
    const scrollbar = document.querySelector(".custom-scrollbar");
    const thumb = document.querySelector(".scroll-thumb");
    const contentHeight = document.body.scrollHeight - window.innerHeight;
    let isDragging = false;
    let startY, startTop;

    // Ensure the thumb height is calculated and set
    const updateThumbHeight = () => {
      const thumbHeight = Math.min(
        Math.max(
          (window.innerHeight / document.body.scrollHeight) *
            window.innerHeight,
          10
        ), // Minimum of 10px
        50 // Maximum of 50px
      );
      thumb.style.height = thumbHeight + "px";
    };

    // Update the thumb's position on the scrollbar
    const updateThumbPosition = () => {
      const scrollPosition = window.scrollY / contentHeight;
      thumb.style.top =
        scrollPosition * (window.innerHeight - thumb.offsetHeight) + "px";
      console.log(scrollPosition.toFixed(2)); // Log the scroll percentage (0 to 1)
    };

    thumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startTop = parseInt(window.getComputedStyle(thumb).top, 10);
      document.body.style.userSelect = "none"; // Disable text selection
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const deltaY = e.clientY - startY;
        const newTop = Math.min(
          Math.max(startTop + deltaY, 0),
          window.innerHeight - thumb.offsetHeight
        );
        thumb.style.top = newTop + "px";
        const scrollPercentage =
          newTop / (window.innerHeight - thumb.offsetHeight);
        window.scrollTo(0, scrollPercentage * contentHeight);
        console.log(scrollPercentage.toFixed(2)); // Log the scroll percentage (0 to 1)
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = ""; // Re-enable text selection
    });

    // Update thumb height and position on resize or scroll
    window.addEventListener("resize", () => {
      updateThumbHeight();
      updateThumbPosition();
    });

    window.addEventListener("scroll", updateThumbPosition);

    // Initialize scrollbar
    updateThumbHeight();
    updateThumbPosition();
  }
}
