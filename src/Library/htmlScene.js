export class htmlScene{
    constructor(cssClass){
        this.setHTMLArray(cssClass)
    }
    setHTMLArray(cssClass){
        this.class = cssClass
        const holder = document.getElementById(this.class)
        this.htmlArray = holder.children
    }
    updateColors(offset = 0){
     
        for(let i = 0; i < this.htmlArray.length; i ++){
            const element = this.htmlArray[i]
            const indexOffset = i + offset
            const randomColor = getRandomColor()
            const hexIndex = "#" + (indexOffset).toString(16).padStart(6, '0');

            const index = element.querySelector(".index")
            const hexNum = element.querySelector(".hexNum")
            const colHex = element.querySelector(".colHex")

            // const newColor = randomColor
            const newColor = hexIndex

            element.style.backgroundColor = newColor
            element.style.color = getOppositeColor(newColor)
            index.innerHTML = indexOffset.toString(10).padStart(8,"0")
            hexNum.innerHTML = newColor
            // colHex.innerHTML = randomColor
        }
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function getOppositeColor(hexColor) {
    // Remove '#' if present
    hexColor = hexColor.replace(/^#/, '');
  
    let r, g, b;
  
    // Handle 3-digit HEX (e.g. #abc)
    if (hexColor.length === 3) {
      r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16);
      g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16);
      b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16);
    } 
    // Handle 6-digit HEX (e.g. #a1b2c3)
    else if (hexColor.length === 6) {
      r = parseInt(hexColor.substr(0, 2), 16);
      g = parseInt(hexColor.substr(2, 2), 16);
      b = parseInt(hexColor.substr(4, 2), 16);
    } 
    // Invalid input
    else {
      throw new Error('Invalid hex color provided: ' + hexColor);
    }
  
    // Invert each channel by subtracting from 255
    const newR = (255 - r).toString(16).padStart(2, '0');
    const newG = (255 - g).toString(16).padStart(2, '0');
    const newB = (255 - b).toString(16).padStart(2, '0');
  
    // Construct final color
    return `#${newR}${newG}${newB}`;
  }
  
  // Example usage:
  console.log(getOppositeColor('#ff0000')); // -> "#00ffff"
  console.log(getOppositeColor('abc'));     // -> "#554433"
  console.log(getOppositeColor('#123456')); // -> "#edcba9"
  