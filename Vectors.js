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

export class Vector2d{
    constructor(x1=0,y1=0,x0=0,y0=0){
        //by default a vector can be defined by just the end position and it will set as start position (0,0) unless specified.
        this.x0 = x0 //starting point of the vector 
        this.y0 = y0
        this.x1 = x1 //ending point of the vector
        this.y1 = y1

        this.mag = Math.sqrt((x0-x1)**2+(y0-y1)**2) //vector magnitude (lenght)
        this.arg = Math.atan2((y1-y0),(x1-x0)) //vector argument (angle)
    }

    draw_vect(){
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")
    }
}

export class VectorPolar{
    constructor(mag, arg,x0=0,y0=0){
        this.x0 = x0
        this.y0 = y0
        
        this.mag = mag
        this.arg = arg

        this.x1 = this.mag*Math.cos(this.arg)+x0
        this.y1 = this.mag*Math.sin(this.arg)+x0
    }

    draw_vect(){
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")
    }
}

export class VectorMath{
    constructor(){
    }

    static PolarToRect(v){
        return new Vector2d(v.x1,v.y1,v.x0,v.y0)
    }

    static RectToPolar(v){
        return new VectorPolar(v.mag, v.arg,v.x0,v.y0)
    }

    static divide(v,a){
        let new_v_polar = new VectorPolar(v.mag/a, v.arg, v.x0, v.y0)
        let new_v_2d = this.PolarToRect(new_v_polar)

        return new_v_2d
    }
}