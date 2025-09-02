import { Vector2d, VectorPolar, VectorMath as VM} from "./Vectors.js"

export class Spring{
    constructor(p0, p1, L0, k, c){
        this.p0 = p0 // start particle
        this.p1 = p1 // end particle
        this.L0 = L0 // lenght at rest
        this.k = k //stiffness coefficient
        this.c = c //damping coefficient
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