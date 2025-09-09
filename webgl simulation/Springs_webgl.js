import { Vector2d, VectorPolar, VectorMath as VM} from "./Vectors_webgl.js"

function draw_line(x0,y0,x1,y1,color){
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.4;
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

export class Spring{
    constructor(p0, p1, L0, k, c){
        this.p0 = p0 // start particle
        this.p1 = p1 // end particle
        this.L0 = L0 // lenght at rest
        this.k = k //stiffness coefficient
        this.c = c //damping coefficient
    }

    draw_spring(){
        //const L0 = this.L0
        const L = VM.subtract(this.p1.pos, this.p0.pos).mag
        const l = 7 //how much space between two coils
        const density = Math.round(L/l) // density of the spring coils
        const unit_dir = VM.normal(new Vector2d(this.p1.pos.x1, this.p1.pos.y1, this.p0.pos.x1, this.p0.pos.y1))
        const unit_dir_ort = VM.orthogonal(unit_dir) //orthogonal to the vector connecting p0 to p1 with oriugin in p0
        const H = 6 //width of the spring
        const ort_scaled = VM.scalar_mul(unit_dir_ort, H)
        let old_start_point = null

        for(let i=0; i<density+1; i++){
            const dir_scaled = VM.scalar_mul(unit_dir,l*i) // this is a vector pointing from p0 to p1, with a lenght corresponding to a joint of the spring (try using .draw_vect() to visualize)

            //draw "straight" coils
            const start_point =  VM.add(VM.add(ort_scaled, dir_scaled),this.p0.pos)
            const end_point = VM.add(start_point, VM.scalar_mul(ort_scaled,-2))
            draw_line(start_point.x1, start_point.y1, end_point.x1, end_point.y1)
            
            //finally we draw the "diagonal" coils that go from the current straight coil end pos to the next straight coil start pos
            if(i!=0 && i!=density+1){
                draw_line(end_point.x1, end_point.y1, old_start_point.x1, old_start_point.y1)
            }
            old_start_point = start_point
        }

        //draw_line(this.p0.pos.x1, this.p0.pos.y1, this.p1.pos.x1, this.p1.pos.y1)
    }

    add_spring_forces_to_particles(){
        // We separate the overall force into two components:
        // (1) FORCE_ELASTIC due to Hookes law
        // (2) DAMPING_FORCE to reduce the oscillation and simulate energy loss

        // (1)-- 
        const distance = VM.subtract(this.p1.pos, this.p0.pos) //distance vector with origin at (0,0) 
        const dL = this.L0-distance.mag
        
        // FORCE_ELASTIC < 0 : compression force (each particles force is towards the other particle)
        // FORCE_ELASTIC > 0 : expansion force (each particles force is opposite to the other particle)
        // the force vector is calculated relative to p0. so the positive force is towards p1, and the negative is the opposite of that
        const FORCE_ELASTIC = this.k*dL  
        const FORCE_ELASTIC_VECT = new VectorPolar(-FORCE_ELASTIC, distance.arg)
        
        // (2)--
        const relative_vel = VM.subtract(this.p1.vel, this.p0.vel)
        const dampingMag = -this.c*VM.dot(relative_vel, VM.normal(distance))
        const DAMPING_FORCE_VECT = new VectorPolar(-dampingMag, distance.arg)


        const TOTAL_FORCE = VM.add(FORCE_ELASTIC_VECT, DAMPING_FORCE_VECT)
        this.p0.add_force(TOTAL_FORCE)
        this.p1.add_force(VM.scalar_mul(TOTAL_FORCE, -1))
    }

}