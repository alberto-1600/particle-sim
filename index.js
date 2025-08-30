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

const N=0
for(let i=0; i<N;i++){
    const x = Math.random()*(canvas.width-50)
    const y = 250 //Math.random()*(canvas.height-50)
    const pos = new Vector2d(x,y)

    const vx = (Math.random()-0.5)*5
    const vy = 0// (Math.random()-0.5)
    const vel = new Vector2d(vx,vy)

    const ax = 0
    const ay = 0
    const acc = new Vector2d(ax,ay)

    const r = 10
    const color = "#00ff00"

    const p = new Particle(pos,vel,acc,r,color)
    particles.push(p)
}

function update()
{
    clearCanvas()
    
    //for(let i=0; i<particles.length;i++){
    //    let p0=particles[i]
    //    //if(i==0){console.log(p0)}
    //    p0.check_boundary_collision()
    //    
    //    for(let j=i+1; j<particles.length; j++){
    //        let p1 = particles[j]
    //        p0.check_particle_collision(p1)
    //    }
    //    p0.update_position()
    //    p0.draw()
    //}

    

    requestAnimationFrame(update)
}


//update()
let p0 = new Particle(
    new Vector2d(100,100),
    new Vector2d(5,2),
    new Vector2d(0,0),
    10,
    "#FF0000"
)



