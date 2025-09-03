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
import {Spring} from "./Springs.js"

const particles = []
const springs = []

const N=10000
for(let i=0; i<N;i++){
    const x = Math.random()*(canvas.width-100)+50
    const y = Math.random()*(canvas.height-100)+50
    const pos = new Vector2d(x,y)

    const vx = (Math.random()-0.5)*6
    const vy = (Math.random()-0.5)*6
    const vel = new Vector2d(vx,vy)

    const ax = 0
    const ay = 0
    const acc = new Vector2d(ax,ay)

    const r = 1
    const color = "#0000ff"

    const p_elasticity = 1
    const w_elasticity = new Vector2d(1,1)

    const p = new Particle(pos,vel,acc,r,color,p_elasticity, w_elasticity)
    particles.push(p)
}

let filtered_clumps = {}

const steps = 2
const column_width = 2
const row_height = 2
function update(){
    clearCanvas()

    //code goes here
    // 0. substeps for loop
    for (let step = 0; step < steps; step++) {
        filtered_clumps = {}
        // 1. reset accelerations
        for (let p of particles) {
            p.acc.x1 = 0;
            p.acc.y1 = 0;
        }

        // ADD ALL FORCES FROM HERE...
        for (let s of springs){
            s.add_spring_forces_to_particles()
        }

        // 2. apply forces & collisions

        //filter particles
        for(let p of particles){
            const grid_x = Math.floor(p.pos.x1/column_width) 
            const grid_y = Math.floor(p.pos.y1/row_height)
            const key = `${grid_x},${grid_y}`
            if(!filtered_clumps[key]){
                filtered_clumps[key] = []
            }
            filtered_clumps[key].push(p)
            p.boundary_collision()
        }
        
        //collision check divided in clumps
        for(let key in filtered_clumps){
            const [gx,gy] = key.split(",").map(Number)

            let neighbors = []
            const neighbors_indexes = [
                `${gx},${gy}`, //same
                `${gx+1},${gy}`, //right
                `${gx+1},${gy+1}`, //down right
                `${gx},${gy+1}`, //down
                `${gx-1},${gy+1}` //down-left
            ]
            for(let index of neighbors_indexes){
                if(filtered_clumps[index]){
                    neighbors.push(filtered_clumps[index])
                }
            }
            const neighbors_flat = neighbors.flat()
            for (let i = 0; i < neighbors_flat.length; i++) {
                for (let j = i + 1; j < neighbors_flat.length; j++) {
                    neighbors_flat[i].particle_collision(neighbors_flat[j]);
                }
            }
        }


        //...TO HERE

        // 3. integrate positions
        for (let p of particles) {
            p.update_position(1/steps); // dt = 0.1
        }
    }

    // 4. draw after finishing all substeps
    for (let s of springs) {
        s.draw_spring();
    }

    for (let p of particles) {
        p.draw();
    }


    //code ends here
    requestAnimationFrame(update)
}

update()






