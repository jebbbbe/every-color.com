export let isFullscreen = false;
export function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        let docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen().then(() => {
                isFullscreen = true;
            });
        } else if (docEl.webkitRequestFullscreen) { /* Safari */
            docEl.webkitRequestFullscreen();
            isFullscreen = true;
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                isFullscreen = false;
            });
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            isFullscreen = false;
        }
    }
    console.log(isFullscreen)
    return isFullscreen;
}

  