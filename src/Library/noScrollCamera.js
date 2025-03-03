import {elements,constants} from "./constants.js"


export class noScrollCamera{
    constructor(  scrollFactor = 1, startPos = 0){
        this.class = elements.ids.main //cssClass
        this.rowClass = elements.classes.template2// rowCssClass
        this.scrollFactor = scrollFactor
        this.position = startPos
        this.setTemplate()
        this.visibleIndex = {
            prev:0,
            curr:0,
        }
        this.addAllElementsToDom()
        this.updateHeight()
        this.updateRowSize()
        this.updatePosition()
        this.resize()
    }
    setTemplate(){
        let templateElement = document.querySelector("." + this.rowClass)
        this.template = templateElement.cloneNode(true)
        this.template.querySelector(".colName").innerHTML = "";
        this.template.querySelector(".colHex").innerHTML = "";
        this.template.removeAttribute('id');
        document.documentElement.style.setProperty('--label-height', '0px');
        templateElement.innerHTML = ""

        templateElement = null
    }
    addAllElementsToDom(){
        let elem = document.getElementById(this.class);
        let fragment = document.createDocumentFragment();
        let newNode
        for (let i = 0; i < constants.maxRows; i++) {
            newNode = this.template.cloneNode(true);
            newNode.style.display = "none";
            fragment.appendChild(newNode);
        }
        elem.appendChild(fragment);
        elem = null;
        fragment = null;
        newNode = null;
    }
    updateHeight(){
        this.height = document.getElementById( this.class ).clientHeight
    }
    updateRowSize(){
        this.rowSize = document.querySelector("." + this.rowClass).clientHeight
    }
    resize(){
        this.updateHeight()
        this.updateRowSize()
        this.visibleIndex.prev = this.visibleIndex.curr
        this.visibleIndex.curr = Math.floor( this.height/ this.rowSize - 0)
        this.visibleIndex.curr = Math.max(this.visibleIndex.curr, 1) // min 1 row visible
        this.visibleIndex.curr = Math.min(this.visibleIndex.curr, constants.maxRows)
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
        this.position = Math.min(constants.absoluteMax - this.visibleIndex.curr + 1, this.position) // unsure
    }
}