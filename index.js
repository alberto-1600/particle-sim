const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")

//Canvas outline
function canvasOutline(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width,0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0,canvas.height);
    ctx.closePath();
    ctx.stroke();
}

// Pulizia dell’intero canvas
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasOutline()
}
clearCanvas()

//Function to draw circles on a single call
function circle(x,y,r,color="#000000"){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fillStyle = color
    ctx.fill()
}

//test
import { Particle } from "./Particles.js";
import { Vector2d, VectorMath as VM, VectorPolar } from "./Vectors.js";

const particles = []

const N=500
for(let i=0; i<N;i++){
    const x = Math.random()*(canvas.width-100)+50
    const y = Math.random()*(canvas.height-100)+50
    const pos = new Vector2d(x,y)

    const vx = (Math.random()-0.5)
    const vy = (Math.random()-0.5)
    const vel = new Vector2d(vx,vy)

    const ax = 0.05
    const ay = 0.05
    const acc = new Vector2d(ax,ay)

    const r = 10
    const color = "#00ff00"

    const p = new Particle(pos,vel,acc,r,color)
    particles.push(p)
}

let timer = 0
const cap = 0
function update(){
    if(timer<cap){
        timer += 1
        requestAnimationFrame(update)
    }
    else{
        timer = 0
        clearCanvas()

        //code goes here
        for(let i=0; i<particles.length;i++){
            particles[i].boundary_collision()

            for(let j=i+1; j<particles.length; j++){
                particles[i].particle_collision(particles[j])
            }

            particles[i].update_position()
            particles[i].draw()
        }
        //code ends here
        requestAnimationFrame(update)
    }
}

update()






