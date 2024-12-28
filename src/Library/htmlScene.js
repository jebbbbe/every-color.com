export class htmlScene{
    constructor(cssClass){
        this.setHTMLArray(cssClass)
    }
    setHTMLArray(cssClass){
        this.class = cssClass
        const holder = document.getElementById(this.class)
        this.htmlArray = holder.children
    }
    randomizeColors(){
        for(let i = 0; i < this.htmlArray.length; i ++){
            const element = this.htmlArray[i]
            const color = getRandomColor()
            element.style.backgroundColor = color
            element.innerHTML = color
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
