import { icons, elements } from "../constants.js"

export async function requestAllIcons(fillColor = "var(--header-text-color, #000000)") {
    let parser = new DOMParser()
    for (const path in icons.paths) {
        const url = icons.paths[path]
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Network error: ${response.status}`)
            }
            const svgText = await response.text()
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
            const svgElement = svgDoc.documentElement
            svgElement.setAttribute("fill", fillColor)
            icons.content[path] = svgElement
        } catch (error) {
            console.error("Error loading SVG:", error)
        }
    }
    for (let d in icons.defaults) {
        // link default icons
        try {
            inlineSvg(elements[d], icons.content[icons.defaults[d]])
        } catch (e) {}
    }
}

export async function inlineSvg(container, content) {
    container.replaceChildren(content)
}
