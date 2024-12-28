const template = document.querySelector


export class noScrollCamera{
    constructor(cssClass, rowCssClass){
        this.class = cssClass
        this.rowClass = rowCssClass
        
        this.setTemplate()
        this.updateHeight()
        this.updateRowSize()
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
    resize(){
        let prevHeight = this.height
        let rowHeight = this.rowSize
        this.updateHeight()
        this.updateRowSize()

       this.addRows(25)

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
}