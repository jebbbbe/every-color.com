import {constants} from "./constants.js"


export class noScrollCamera{
    constructor(cssClass, rowCssClass, scrollFactor = 1, startPos =0){
        this.class = cssClass
        this.rowClass = rowCssClass
        this.scrollFactor = scrollFactor
        this.position = startPos
        this.setTemplate()
        this.updateHeight()
        this.updateRowSize()
        this.updateRowCount()
        this.updatePosition()
    }
    setTemplate(){
        // const parent = document.getElementById(this.class)
        let templateElement = document.querySelector("." + this.rowClass)
        this.template = templateElement.cloneNode(true)
        this.template.querySelector(".colName").innerHTML = "";
        this.template.querySelector(".colHex").innerHTML = "";

        document.documentElement.style.setProperty('--label-height', '0px');
        templateElement.innerHTML = ""
        templateElement = null
    }
    getTemplate(){
        // const newNode = this.template.cloneNode(true)
        // newNode.style.cssText = this.templateStyle.cssText; 
        // return newNode
        return this.template.cloneNode(true)
    }
    updateHeight(){
        // const elem = document.getElementById( this.class )
        // this.height = elem.clientHeight
        this.height = document.getElementById( this.class ).clientHeight
    }
    updateRowSize(){
        // const elem = document.querySelector("." + this.rowClass)
        // this.rowSize = elem.clientHeight
        this.rowSize = document.querySelector("." + this.rowClass).clientHeight
    }
    updateRowCount(){
        // const elem = document.getElementById( this.class )
        // this.rowCount = elem.children.length
        this.rowCount = document.getElementById( this.class ).children.length
    }
    resize(){
        let currCount = this.rowCount
        this.updateHeight()
        this.updateRowSize()
        this.updateRowCount()

        this.rowCount = Math.floor( this.height/ this.rowSize -0) //  0.5 or higher if there is a footer, if no footer can be set to 0 for infinite looking scroll. woulkd nee to add padding to last colro tho
        // console.log("rowCount")
        // console.log(this.rowCount)
        // console.log(this.height)
        // console.log(this.rowSize)
        if(this.rowCount > currCount){
            this.addRows(this.rowCount-currCount)
        }else if (this.rowCount < currCount){
            this.removeRows(currCount-this.rowCount)
        }
        this.sanitizePosition()
    }
    addRows(count){
        let elem = document.getElementById( this.class )
        for(let i = 0; i<count; i++){
            elem.appendChild( this.getTemplate());
        }
        elem = null
    }
    removeRows(count){
        let elem = document.getElementById( this.class )
        // for(let i = 0; i<count; i++){
        //     if (elem.lastChild) { // Ensure there is a last child to remove
        //         elem.removeChild(elem.lastChild); // Remove the last child
        //     }else{
        //         break;
        //     }
        // }
        let lastNode
        for (let i = 0; i < count; i++) {
            lastNode = elem.lastChild;
            if (lastNode) {
                lastNode.replaceWith(lastNode.cloneNode(false)); // Removes all listeners
                lastNode.remove();  // Remove from DOM
                lastNode = null;     // Remove reference
            }
        }
        lastNode = null
        elem = null
    }
    updatePosition(delta = 0){
        this.position += -delta * this.scrollFactor
        this.sanitizePosition()
        return this.position
    }
    setPosition(location){
        this.position = location
        this.sanitizePosition()
    }
    sanitizePosition(){
        this.position = Math.max(constants.absoluteMin, this.position)
        this.position = Math.min(constants.absoluteMax - this.rowCount +1, this.position) // unsure
    }
}