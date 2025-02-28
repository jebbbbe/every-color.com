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
        document.documentElement.style.setProperty('--header-height', '0px');
        document.documentElement.style.setProperty('--footer-height', '0px');
        // document.documentElement.style.setProperty('--label-height', '0px');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                isFullscreen = false;
            });
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            isFullscreen = false;
        }
        document.documentElement.style.removeProperty('--header-height');
        document.documentElement.style.removeProperty('--footer-height');
        // document.documentElement.style.removeProperty('--label-height');
    }
    console.log(isFullscreen)
    return isFullscreen;
}

  