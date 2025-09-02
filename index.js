const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")

//chart data string 
const chartData = {
    labels: [],  // time/frame
    datasets: [{
        label: "Distance between particles",
        data: [],
        borderColor: "blue",
        fill: false,
        tension: 0.1
    }]
};
const ctx_charts = document.getElementById("distanceChart").getContext("2d");
const distanceChart = new Chart(ctx_charts, {
    type: "line",
    data: chartData,
    options: {
        animation: false,  // disable animation for real-time updates
        scales: {
            x: { title: { display: true, text: "Frame" } },
            y: { title: { display: true, text: "Distance" } }
        }
    }
});



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
    const x = Math.random()*(canvas.width-100)+50
    const y = Math.random()*(canvas.height-100)+50
    const pos = new Vector2d(x,y)

    const vx = (Math.random()-0.5)*10
    const vy = (Math.random()-0.5)*10
    const vel = new Vector2d(vx,vy)

    const ax = 0
    const ay = 0
    const acc = new Vector2d(ax,ay)

    const r = 20
    const color = "#0000ff"

    const p_elasticity = 0.5
    const w_elasticity = new Vector2d(1,1)

    const p = new Particle(pos,vel,acc,r,color,p_elasticity, w_elasticity)
    particles.push(p)
}

const p0 = new Particle(
    new Vector2d(100,300),
    new Vector2d(0,0),
    new Vector2d(0,0),
    20,
    "#ff0000",
    1,
    new Vector2d(1,1)
)

const p1 = new Particle(
    new Vector2d(500,300),
    new Vector2d(0,0),
    new Vector2d(0,0),
    20,
    "#0000ff",
    1,
    new Vector2d(1,1)
)

particles.push(p0)
particles.push(p1)

const steps = 10
function update(){
    clearCanvas()

    //code goes here
    // 0. substeps for loop
    for (let step = 0; step < steps; step++) {
        // 1. reset accelerations
        for (let p of particles) {
            p.acc.x1 = 0;
            p.acc.y1 = 0;
        }

        // 2. apply forces & collisions
        for (let i = 0; i < particles.length; i++) {
            particles[i].boundary_collision();

            for (let j = i + 1; j < particles.length; j++) {
                particles[i].particle_collision(particles[j]);
                // particles[i].spring_force(particles[j]);
                // particles[i].gravitational_force(particles[j]);
            }
        }

        // 3. integrate positions
        for (let p of particles) {
            p.update_position(1/steps); // dt = 0.1
        }
    }

    // 4. draw after finishing all substeps
    for (let p of particles) {
        p.draw();
    }

    //code ends here
    requestAnimationFrame(update)
}

update()






