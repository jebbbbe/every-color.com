import { icons } from "../constants.js";

export async function inlineSvg(container, url, fillColor = "var(--header-text-color, #000000)") {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }
        const svgText = await response.text();
        container.innerHTML = svgText;

        const svgElement = container.querySelector("svg");
        if (svgElement) {
            svgElement.setAttribute("fill", fillColor);
        }
    } catch (error) {
        console.error("Error loading SVG:", error);
    }
}

export function setUpIcons() {
    for (let id in icons.ids) {
        try{
            icons.elements[id] = document.getElementById(icons.ids[id])
            inlineSvg(icons.elements[id], icons.paths[id])
        }catch(e){
            console.log(e)
        }
    }
}
