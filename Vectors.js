const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")
function draw_line(x0,y0,x1,y1,color){
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath()
    ctx.moveTo(x0,y0)
    ctx.lineTo(x1,y1)
    ctx.closePath()
    ctx.stroke()
}

function draw_circle(x,y,r,color="#000000"){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fillStyle = color
    ctx.fill()
}

export class Vector2d{
    constructor(x1=0,y1=0,x0=0,y0=0){
        //by default a vector can be defined by just the end position and it will set as start position (0,0) unless specified.
        this.x0 = x0 //starting point of the vector 
        this.y0 = y0
        this.x1 = x1 //ending point of the vector
        this.y1 = y1

        this.horizontal_component = this.x1-this.x0
        this.vertical_component = this.y1-this.y0

        this.mag = Math.sqrt((x0-x1)**2+(y0-y1)**2) //vector magnitude (lenght)
        this.arg = Math.atan2((y1-y0),(x1-x0)) //vector argument (angle)
    }

    draw_vect(){
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")
        draw_circle(this.x1, this.y1, 5, "#ff0000")
    }
}

export class VectorPolar{
    constructor(mag, arg,x0=0,y0=0){
        this.x0 = x0
        this.y0 = y0
        
        this.mag = mag
        this.arg = arg

        this.x1 = this.mag*Math.cos(this.arg)+x0
        this.y1 = this.mag*Math.sin(this.arg)+y0
    }

    draw_vect(){
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")
    }
}

export class VectorMath{
    constructor(){
    }

    static add(v1,v2){
        //returns a vector with origin at x0=0, y0=0 with components corresponding to the sum of components of v1 and v2
        return new Vector2d(
            v1.horizontal_component+v2.horizontal_component,
            v1.vertical_component+v2.vertical_component
        )
    }
}