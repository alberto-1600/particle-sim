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

        this.horizontal_component = this.x1-this.x0
        this.vertical_component = this.y1-this.y0
    }

    draw_vect(){
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")
        draw_circle(this.x1, this.y1, 5, "#ff0000")
    }
}

export class VectorMath{
    static PolarToRect(v){
        //returns a Vector2d given a VectorPolar
        return new Vector2d(v.x1,v.y1,v.x0,v.y0)
    }

    static shift(v,v_shift){
        //returns a Vector2d that is v (Vector2d) shifted by v_shift (Vector2d)
        return new Vector2d(
            v.x1+v_shift.horizontal_component,
            v.y1+v_shift.vertical_component,
            v.x0+v_shift.horizontal_component,
            v.y0+v_shift.vertical_component 
        )
    }

    static opposite(v){
        //returns the opposite of v (same angle and magnitude, but origin and end are swapped)
        return new Vector2d(v.x0,v.y0,v.x1,v.y1)
    }

    static add(v1,v2){
        //v1,v2 can be both Vector2d and VectorPolar
        //returns a vector with origin at x0=0, y0=0 with components corresponding to the sum of components of v1 and v2
        return new Vector2d(
            v1.horizontal_component+v2.horizontal_component,
            v1.vertical_component+v2.vertical_component
        )
    }

    static normalize(v){
        //returns a unit Vector2d in the same direction as v
        return this.PolarToRect(new VectorPolar(1,v.arg))
    }

    static dot(v1,v2){
        //returns the dot product between v1 and v2
        return v1.mag*v2.mag*Math.cos(v2.arg-v1.arg)
    }

    static orthogonal(v){
        //returns a Vector2d orthogonal to v (clockwise) with the same origin
        return this.PolarToRect(new VectorPolar(v.mag, v.arg+Math.PI/2,v.x0,v.y0))
    }

    static simmetric(v1,v2){
        //returns a Vector2d that is simmetric to v with axis u
        return new VectorPolar(
            v1.mag,
            2*v2.arg-v1.arg,
            v1.x0,
            v1.y0
        )
    }
}