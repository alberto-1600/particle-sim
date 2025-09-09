
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
    }
    
    // Magnitude of the vector
    get mag() { 
        return Math.hypot(this.x1 - this.x0, this.y1 - this.y0); 
    }
    set mag(newMag) {
        const angle = this.arg; // current angle
        this.x1 = this.x0 + newMag * Math.cos(angle);
        this.y1 = this.y0 + newMag * Math.sin(angle);
    }

    // Angle of the vector
    get arg() { 
        return Math.atan2(this.y1 - this.y0, this.x1 - this.x0); 
    }
    set arg(newArg) {
        const magnitude = this.mag;
        this.x1 = this.x0 + magnitude * Math.cos(newArg);
        this.y1 = this.y0 + magnitude * Math.sin(newArg);
    }

    draw_vect(){
        //draw the vector's line
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")

        //draw the vector's head (arrow) using vectors
        const arrow_angle = Math.PI/10
        const arrow_lenght = 20
        const arrow_line = VectorMath.phase_shift(VectorMath.scalar_mul(VectorMath.normal(VectorMath.flip(this)),arrow_lenght),arrow_angle)
        draw_line(arrow_line.x0, arrow_line.y0, arrow_line.x1, arrow_line.y1, "#000000ff")
        
        const arrow_line2 = VectorMath.simmetric(arrow_line, this)
        draw_line(arrow_line2.x0, arrow_line2.y0, arrow_line2.x1, arrow_line2.y1, "#000000ff")

        //draw the vector's origin with a circle
        draw_circle(this.x0, this.y0, 4, "#000000")
    }
}

export class VectorPolar{
    constructor(mag, arg,x0=0,y0=0){
        this.x0 = x0
        this.y0 = y0

        this.x1 = mag*Math.cos(arg)+x0
        this.y1 = mag*Math.sin(arg)+y0
    }

    // Magnitude of the vector
    get mag() { 
        return Math.hypot(this.x1 - this.x0, this.y1 - this.y0); 
    }

    set mag(newMag) {
        const angle = this.arg; // current angle
        this.x1 = this.x0 + newMag * Math.cos(angle);
        this.y1 = this.y0 + newMag * Math.sin(angle);
    }

    // Angle of the vector
    get arg() { 
        return Math.atan2(this.y1 - this.y0, this.x1 - this.x0); 
    }

    set arg(newArg) {
        const magnitude = this.mag;
        this.x1 = this.x0 + magnitude * Math.cos(newArg);
        this.y1 = this.y0 + magnitude * Math.sin(newArg);
    }

    draw_vect(){
        //draw the vector's line
        draw_line(this.x0, this.y0, this.x1, this.y1, "#000000")

        //draw the vector's head (arrow) using vectors
        const arrow_angle = Math.PI/10
        const arrow_lenght = 20
        const arrow_line = VectorMath.phase_shift(VectorMath.scalar_mul(VectorMath.normal(VectorMath.flip(this)),arrow_lenght),arrow_angle)
        draw_line(arrow_line.x0, arrow_line.y0, arrow_line.x1, arrow_line.y1, "#000000ff")
        
        const arrow_line2 = VectorMath.simmetric(arrow_line, this)
        draw_line(arrow_line2.x0, arrow_line2.y0, arrow_line2.x1, arrow_line2.y1, "#000000ff")

        //draw the vector's origin with a circle
        draw_circle(this.x0, this.y0, 4, "#000000")
    }
}

export class VectorMath{
    //MISC
    static PolarToRect(v){
        //returns a Vector2d given a VectorPolar
        return new Vector2d(v.x1,v.y1,v.x0,v.y0)
    }

    //SCALAR MATH
    static scalar_mul(v, a){
        //scalar multiplication between v and a. returns a Vector2d whose magnitude is v.mag*a
        return this.PolarToRect(new VectorPolar(v.mag*a, v.arg, v.x0, v.y0))
    }

    static phase_shift(v,phi){
        //returns a Vector2d whose phase is v.arg shifted by phi
        return this.PolarToRect(new VectorPolar(v.mag, v.arg+phi, v.x0, v.y0))
    }
    

    //VECTOR MATH
    static setOrigin(v, new_origin){
        //returns a Vector2d with same mag and arg as v, but with origin in new_origin (Vector2d)
        return this.PolarToRect(
            new VectorPolar(
                v.mag,
                v.arg,
                new_origin.x1,
                new_origin.y1
            )
        )
    }

    static copyOrigin(v1,v2){
        //returns a vector with the same mag and arg as v1, but with the origin of v2
        //(copies v2 origin into v1)
        return this.PolarToRect(
            new VectorPolar(
                v1.mag,
                v1.arg,
                v2.x0,
                v2.y0
            )
        )
    }

    static shift(v,v_shift){
        //returns a Vector2d that is v (Vector2d) shifted by v_shift (Vector2d)
        return new Vector2d(
            v.x1+v_shift.x1-v_shift.x0,
            v.y1+v_shift.y1-v_shift.y0,
            v.x0+v_shift.x1-v_shift.x0,
            v.y0+v_shift.y1-v_shift.y0
        )
    }

    static flip(v){
        //returns the opposite of v (same angle and magnitude, but origin and end are swapped)
        return new Vector2d(v.x0,v.y0,v.x1,v.y1)
    }

    static add(v1,v2){
        //v1,v2 can be both Vector2d and VectorPolar
        //returns a vector with origin at x0=0, y0=0 with components corresponding to the sum of components of v1 and v2
        return new Vector2d(
            (v1.x1 - v1.x0) + (v2.x1 - v2.x0),
            (v1.y1 - v1.y0) + (v2.y1 - v2.y0),
            0,
            0
        )
    }

    static subtract(v1,v2){
        return this.add(v1, this.flip(v2))
    }

    static normal(v){
        //returns a unit Vector2d in the same direction as v with the same origin
        return this.PolarToRect(new VectorPolar(1,v.arg, v.x0, v.y0))
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