import { constants, icons } from "../constants.js";
import { inlineSvg } from "./svg.js";

export let isFullscreen = false;
export function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        let docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen().then(() => {});
        } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen(); // Safari
            isFullscreen = true;
        }
        isFullscreen = true;
        inlineSvg(icons.elements.fullscreen, icons.paths.fullscreen_exit);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); // Safari
        }
        isFullscreen = false;
        inlineSvg(icons.elements.fullscreen, icons.paths.fullscreen);
    }
    return isFullscreen;
}

export function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        isFullscreen = false;
        inlineSvg(icons.elements.fullscreen, icons.paths.fullscreen);
    } else {
        isFullscreen = true;
        inlineSvg(icons.elements.fullscreen, icons.paths.fullscreen_exit);
    }
}
