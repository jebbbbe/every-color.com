export function mapToGradientI(hexColor) {// Maps a hexadecimal color based on reversing every other group of 256 colors.
    let group = (hexColor >> 8) & 0xffff // Extract the base 256 group the color is in, Equivalent to integer division by 256
    let position = hexColor & 0xff // Determine the position within the group, Equivalent to modulo 256
    let reversedPosition = group % 2 === 1 ? 255 - position : position
    let newHexColor = (group << 8) | reversedPosition // Reconstruct the new hexadecimal color value
    return newHexColor
}
export var unmapToGradientI = mapToGradientI // unmap is equivilant operation

export function mapToGradientII(hexColor) {// Extract the base 256 group the color is in
    let group = (hexColor >> 8) & 0xffff // Equivalent to integer division by 256
    let superGroup = (hexColor >> 16) & 0xff // Determine the 256*256 supergroup
    let position = hexColor & 0xff // Equivalent to modulo 256
    let reversedPosition = position
    if (group % 2 === 1) {
        // Check if the group or supergroup is odd (reverse order accordingly)
        reversedPosition = 255 - position
    }
    if (superGroup % 2 === 1) {
        // Reverse the group as well within the supergroup
        group = 255 - group
    }
    let newHexColor = (superGroup << 16) | (group << 8) | reversedPosition // Reconstruct the new hexadecimal color value
    return newHexColor
}
export var unmapToGradientII = mapToGradientII // unmap is equivilant operation

export function mapToGradientIII(hexColor) {//Maps a hexadecimal color based on reversing every other group of 256^2 = 65536 colors.
    let group = hexColor >> 16 // Extract the base 256^2 group the color is in (equivalent to integer division by 65536)
    let position = hexColor & 0xffff // Determine the position within the group (equivalent to modulo 65536)
    let reversedPosition = group % 2 === 1 ? 0xffff - position : position // If the group is odd, reverse the order within the group
    let newHexColor = (group << 16) | reversedPosition // Reconstruct the new hexadecimal color value
    return newHexColor
}
export var unmapToGradientIII = mapToGradientIII // unmap is equivilant operation

export function mapToGradientIV(hexColor) {
    return mapToGradientI(mapToGradientIII(hexColor))
}
export function unmapToGradientIV(hexColor) {
    return mapToGradientIII(mapToGradientI(hexColor))
}
