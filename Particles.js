import { Vector2d, VectorPolar } from "./Vectors.js";
import { VectorMath as VM } from "./Vectors.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")

//Function to draw circles on a single call
function circle(x,y,r,color="#000000"){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fillStyle = color
    ctx.fill()
}

export class Particle{
    constructor(pos, vel, acc, r, color, particle_elasticity, wall_elasticity){
        this.pos = pos //Vector2d with origin at (0,0) and points to the particle position
        this.vel = vel //Vector2d
        this.acc = acc //Vector2d

        this.r=r;
        this.color=color

        this.p_elasticity = particle_elasticity //elasticity between particles (0: all energy is dissipated on contact 1: no energy is dissipated on contact)
        this.w_elasticity = wall_elasticity //Vector2d. elasticity between walls and particles as a Vector2d to separate the vertical and horizontal boundaries
    }
    
    draw(){
        circle(this.x, this.y, this.r, this.color)
    }

    //setters and getters to update x,y,vx,vy,ax,ay
    get x(){return this.pos.x1}
    set x(new_x) {this.pos.x1 = new_x}

    get y(){return this.pos.y1}
    set y(new_y) {this.pos.y1 = new_y}

    get vx(){return this.vel.x1}
    set vx(new_vx) {this.vel.x1 = new_vx}

    get vy(){return this.vel.y1}
    set vy(new_vy) {this.vel.y1 = new_vy}

    get ax(){return this.acc.x1}
    set ax(new_ax) {this.acc.x1 = new_ax}

    get ay(){return this.acc.y1}
    set ay(new_ay) {this.acc.y1 = new_ay}
  

    update_position(){
        const new_vel = VM.add(this.vel, this.acc) // new_vel += this.acc
        const new_pos = VM.add(this.pos, this.vel) // new_pos += this.vel
        
        this.pos.x1 = new_pos.x1
        this.pos.y1 = new_pos.y1
        this.vel.x1 = new_vel.x1
        this.vel.y1 = new_vel.y1
    }

    particle_collision(other){
        //the particle-to-particle collision is handled in 3 steps:
        // (1) check if the distance < sum of radii
        // if (1)--->(2) fix the overlap that can happen between frames (positional correction)
        //     after (2)--->(3) update velocities according to masses, momentum and energy
        //
        // all of this should only be calculated once per pair of particle,
        // THIS SHOULD NEVER HAPPEN:
        //      p0.particle_collision(p1)
        //      p1.particle_collision(p0)
        
        //(1)
        const distance = VM.setOrigin(VM.subtract(other.pos,this.pos),this.pos)
        if(distance.mag < this.r+other.r){
            //set masses to arbitrary value for velocities calculations
            const m1 = this.r**2
            const m2 = other.r**2
            //(2) POSITIONAL CORRECTION
            const penetration = (this.r+other.r)-distance.mag
            //update this particle's position by half the penetration
            const shift = new VectorPolar(
                penetration/2,
                distance.arg,
                this.x1,
                this.y1
            )
            const this_new_pos = VM.add(this.pos, VM.flip(shift))
            this.pos.x1 = this_new_pos.x1;
            this.pos.y1 = this_new_pos.y1;

            const other_new_pos = VM.add(other.pos, shift)
            other.pos.x1 = other_new_pos.x1
            other.pos.y1 = other_new_pos.y1

            //(3) VELOCITIES UPDATE
            let normal;
            if (distance.mag === 0) {
                normal = { x1: 1, y1: 1 }; // arbitrary
            } else {
                normal = VM.normal(distance)
            }
            // projects the velocities onto the normal vector
            // only the velocities on the normal direction change on collision
            const v1n = VM.dot(this.vel, normal)
            const v2n = VM.dot(other.vel, normal)

            // use conservation of momentum and kinetic energy to find the normal velocities after collision
            const v1n_after = (v1n*(m1-m2)+2*m2*v2n)/(m1+m2)
            const v2n_after = (v2n*(m2-m1)+2*m1*v1n)/(m1+m2)

            // find how much the velocities change and use that to update the velocities
            const v1_change = VM.scalar_mul(normal, v1n_after-v1n)
            const v2_change = VM.scalar_mul(normal, v2n_after-v2n)

            const new_vel = VM.scalar_mul(VM.add(this.vel, v1_change),this.p_elasticity)
            this.vel.x1 = new_vel.x1
            this.vel.y1 = new_vel.y1

            const other_new_vel = VM.scalar_mul(VM.add(other.vel, v2_change),this.p_elasticity)
            other.vel.x1 = other_new_vel.x1
            other.vel.y1 = other_new_vel.y1
        }
    }

    boundary_collision(){
        //NOTE: a better approach would be to check where the particle should be on the next frame based on it's velocity (so instead of just "sticking" the particle to the boundary, actually set its corrected position according to the speeds overall magnitude and direction)
        //collision with the screen edge are handled in two steps (done separetly for x and y):
        // (1) POSITIONAL CORRECTION: if the particle overlapped the boundary for any reason (mainly high speed/acceleration) it gets set back to the closest point in the boundary
        // (2) VELOCITY UPDATE: after (1) the velocity is flipped to simulate bouncing
        const ex = this.w_elasticity.x1 //elasticity of walls 
        const ey = this.w_elasticity.y1
        // X
        if(this.pos.x1+this.r > canvas.width){
            this.pos.x1 = canvas.height-this.r
            this.vel.x1 *= -1
        }
        else if(this.pos.x1-this.r <= 0){
            this.pos.x1 = this.r
            this.vel.x1*=-1*ex
        }

        // Y
        if(this.pos.y1+this.r > canvas.height){
            this.pos.y1 = canvas.height-this.r
            this.vel.y1 *= -1
        }
        else if(this.pos.y1-this.r <= 0){
            this.pos.y1 = this.r
            this.vel.y1 *= -1*ey
        }
    }

    gravitational_force(other){
        //when called, this method updates this particle's and the other particle's acceleration to match a gravitational pull between the two
        //this should never be called twice for the same couple of particles (same as particle_collision())
        const m1 = this.r**2
        const m2 = other.r**2

        const distance = VM.setOrigin(VM.subtract(other.pos,this.pos),this.pos) //R is the distance as a vector

        const G = 0.1 //universal gravitational constant

        const force_mag = G*(m1*m2)/(distance.mag**2) 

        const this_force = VM.PolarToRect(new VectorPolar(force_mag, distance.arg))
        const other_force = VM.scalar_mul(VM.PolarToRect(new VectorPolar(force_mag, distance.arg)),-1)
        this.acc.x1 = this_force.x1/m1 //F=m*a thus a=F/m
        this.acc.y1 = this_force.y1/m1

        other.acc.x1 = other_force.x1/m2
        other.acc.y1 = other_force.y1/m2

    }
}