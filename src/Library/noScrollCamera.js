const template = document.querySelector

const absoluteMin = 0
const absoluteMax = 16777216 - 1// 256 * 256 * 256
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
        this.template = document.querySelector("." + this.rowClass).cloneNode(true)
        // console.log("template")
        // console.log(this.template)
    }
    getTemplate(){
        return this.template.cloneNode(true)
    }
    updateHeight(){
        const elem = document.getElementById( this.class )
        this.height = elem.clientHeight
    }
    updateRowSize(){
        const elem = document.querySelector("." + this.rowClass)
        this.rowSize = elem.clientHeight
    }
    updateRowCount(){
        const elem = document.getElementById( this.class )
        this.rowCount = elem.children.length
    }
    resize(){
        let currCount = this.rowCount
        // let prevHeight = this.height
        // let rowHeight = this.rowSize
        this.updateHeight()
        this.updateRowSize()
        this.updateRowCount()

        this.rowCount = Math.floor( this.height/ this.rowSize) //-1
        console.log("rowCount")
        console.log(this.rowCount)
        // console.log(this.height)
        // console.log(this.rowSize)
        if(this.rowCount > currCount){
            this.addRows(this.rowCount-currCount)
        }else if (this.rowCount < currCount){
            this.removeRows(currCount-this.rowCount)
        }

        // console.log(this.rowCount)

        // this.addRows(25)

    }
    addRows(count){
        const elem = document.getElementById( this.class )
        for(let i = 0; i<count; i++){
            elem.appendChild( this.getTemplate());
        }
    }
    removeRows(count){
        const elem = document.getElementById( this.class )
        for(let i = 0; i<count; i++){
            if (elem.lastChild) { // Ensure there is a last child to remove
                elem.removeChild(elem.lastChild); // Remove the last child
            }else{
                break;
            }
        }
    }
    updatePosition(delta = 0){
        this.position += -delta * this.scrollFactor
        this.position = Math.max(absoluteMin, this.position)
        this.position = Math.min(absoluteMax - this.rowCount, this.position) // unsure
        console.log(this.position)
        return this.position
    }
}