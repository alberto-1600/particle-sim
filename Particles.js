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
    constructor(pos,vel,acc,r,color){
        this.pos = pos //Vector2d with origin at (0,0) and points to the particle position
        this.vel = vel //Vector2d
        this.acc = acc //Vector2d

        this.r=r;
        this.color=color
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

    static_collision(other){
        //checks if two particles are overlapping (1)
        //if so updates the positions of both particles so that they touching on their edge
        //done by shifting the two particles along the axis of their centers 
        const distance = VM.subtract(this.pos, other.pos)
        if(distance.mag < this.r+other.r){
            console.log("static collision")
        }
    }
}