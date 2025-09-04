const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")
const fpsDisplay = document.getElementById("fps")

const maxSamples = 100 // how many elements to show on the chart (this is also how many fps measures we use to find the average)
const ctxChart = document.getElementById("fpsChart").getContext("2d");
const fpsChart = new Chart(ctxChart, {
    type: "line",
    data: {
        labels: Array(maxSamples).fill(''), // placeholder labels
        datasets: [
            {
                label: 'Average FPS',
                data: Array(maxSamples).fill(0),
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                pointRadius: 0
            },
            {
                label: 'FPS',
                data: Array(maxSamples).fill(0),
                borderColor: "black",
                borderWidth: 0.5,
                fill: false,
                tension: 0.2,
                pointRadius: 0
            },
            {
                label: 'average SPS',
                data: Array(maxSamples).fill(0),
                borderColor: "lime",
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                pointRadius: 0
            }
        ]
    },
    options: {
        animation: false,
        responsive: false,
        scales: {
            y: { 
                beginAtZero: true,
                position: "right"
            }
        },
        plugins: { 
            legend: { 
                display: true 
            } }
    }
});

//HELPER FUNCTIONS TO DRAW
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

    const vx = (Math.random()-0.5)*2
    const vy = (Math.random()-0.5)*2
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



//function to separate physics handling from drawing
function update_physics(){
    let filtered_clumps = {}
    const steps = 2
    const column_width = particles[0].r*2
    const row_height = particles[0].r*2

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
}
 
const frameTimes = Array(maxSamples).fill(0) // store frame counts to display the average
const avgFrameTimes = Array(maxSamples).fill(0) //store avg frame counts to display the average over time
const simTimes = Array(maxSamples).fill(0)
const avgSimTimes = Array(maxSamples).fill(0)

function update_simulation(){
    const now = performance.now() //time before the simulation

    //clear screen
    clearCanvas()

    //run physics
    update_physics()
    const after_physics = performance.now() // to check how much time the physics are taking to compare with the time taken for rendering

    //draw
    for (let s of springs) {
        s.draw_spring();
    }

    for (let p of particles) {
        p.draw();
    }  

    // FIND FPS
    const after = performance.now() //time after the simulation
    const fps = 1/((after-now)/1000) //how many frames the simulation is running

    // FIND SPS (simulations per seconds)
    const sps = 1/((after_physics-now)/1000)

    // UPDATE FPS LIST
    frameTimes.push(fps)
    if(frameTimes.length>maxSamples) {frameTimes.shift()}

    // UPDATE AVERAGE FPS LIST
    const avg_fps = frameTimes.reduce((a,b)=>a+b, 0)/frameTimes.length
    avgFrameTimes.push(avg_fps)
    if(avgFrameTimes.length>maxSamples) {avgFrameTimes.shift()}

    //UPDATE SPS LIST
    simTimes.push(sps)
    if(simTimes.length>maxSamples) {simTimes.shift()}

    //UPDATE AVERAGE SPS LIST
    const avg_sps = simTimes.reduce((a,b)=>a+b, 0)/simTimes.lenght
    avgSimTimes.push(avg_sps)
    if(avgSimTimes.length>maxSamples) {avgSimTimes.shift()}


    // UPDATE CHARTS
    fpsChart.data.datasets[1].data = frameTimes.slice()
    fpsChart.data.datasets[0].data = avgFrameTimes.slice()
    fpsChart.data.datasets[2].data = avgSimTimes.slice()
    fpsChart.update("none")

    requestAnimationFrame(update_simulation)
}

update_simulation()






