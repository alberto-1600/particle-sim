import { Vector2d } from "./Vectors.js";
import { VectorMath } from "./Vectors.js";

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
    constructor(pos,vel,acc,r,color){
        this.x = pos.x1;
        this.y = pos.y1;
        this.vx = vel.x1;
        this.vy = vel.y1;
        this.ax = acc.x1;
        this.ay = acc.y1;
        this.r=r;
        this.color=color

        this.last_frame_collision = false
        this.current_frame_collision = false

        this.collision_detected = false
    }

    draw(){
        circle(this.x, this.y, this.r, this.color)
    }

    check_boundary_collision(){
        if(this.x+this.r > canvas.width || this.x-this.r < 0){
            this.vx*=-0.9
        }
        if(this.y+this.r > canvas.height || this.y-this.r < 0){
            this.vy*=-0.9
        }
    }

    check_particle_collision(other){
        //p1 is the particle we're checking the collision with
        let distance_vector = new Vector2d(other.x, other.y, this.x, this.y)

        //the next block of code is to set "collision_detected" only if there was a collision
        //  in this frame and no collision in the frame before, to prevent overlapping
        this.last_frame_collision = this.current_frame_collision
        if(distance_vector.mag < (this.r + other.r)){
            this.current_frame_collision = true
        }
        else{
            this.current_frame_collision = false
        }
        this.collision_detected = this.last_frame_collision==false && this.current_frame_collision==true

        if(this.collision_detected){
            //now the next block of code is to elaborate the collision and modify the velocities according to physics

            //first we displace the balls accordingly if they are overlapping
            const mid_distance = VectorMath.divide(distance_vector,2)
            mid_distance.draw_vect()

            let m0 = this.r**2 //we define mass=radius**2
            let m1 = other.r**2

            //we can calculate vx and vy separately
            //vx first
            let v0xi = this.vx // p0 initial velocity x
            let v1xi = other.vx // p1 initial velocity x

            let v0xf = ((m0-m1)*v0xi + 2*m1*v1xi) / (m0+m1)
            let v1xf = ((m1-m0)*v1xi + 2*m0*v0xi) / (m0+m1)

            this.vx = v0xf
            other.vx = v1xf

            //and the same for vy
            let v0yi = this.vy // p0 initial velocity y
            let v1yi = other.vy // p1 initial velocity y

            let v0yf = ((m0-m1)*v0yi + 2*m1*v1yi) / (m0+m1)
            let v1yf = ((m1-m0)*v1yi + 2*m0*v0yi) / (m0+m1)

            this.vy = v0yf
            other.vy = v1yf
        }
        // collision check finished

        return this.collision_detected //return true if the collision happens as described on another comment (only for logging purposes)
    }

    update_position(){
        this.vx += this.ax
        this.vy += this.ay
        this.x += this.vx
        this.y += this.vy
    }
}