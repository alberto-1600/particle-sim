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
    new Vector2d(250,300),
    new Vector2d(0,0),
    new Vector2d(0,0),
    20,
    "#ff0000",
    1,
    new Vector2d(1,1)
)

const p1 = new Particle(
    new Vector2d(455,300),
    new Vector2d(0,0),
    new Vector2d(0,0),
    20,
    "#0000ff",
    1,
    new Vector2d(1,1)
)

particles.push(p0)
particles.push(p1)

//particles.push(p0)
//particles.push(p1)

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
        for(let p of particles){
            p.acc.x1 = 0
            p.acc.y1 = 0
        }
        
        for(let i=0; i<particles.length;i++){
            particles[i].boundary_collision()
            

            for(let j=i+1; j<particles.length; j++){
                particles[i].particle_collision(particles[j])
                particles[i].spring_force(particles[j])
                //particles[i].gravitational_force(particles[j])
            }

            particles[i].update_position()
            particles[i].draw()
        }

        //distance logging on the chart 
        // Example: log distance between particle 0 and particle 1
        if (particles.length >= 2) {
            const delta = VM.subtract(particles[1].pos, particles[0].pos);
            const dist = delta.mag;

            chartData.labels.push(timer);  // or frame count
            chartData.datasets[0].data.push(dist);

            // Limit the number of points to avoid slowing down
            const maxPoints = 2000;
            if (chartData.labels.length > maxPoints) {
                chartData.labels.shift();
                chartData.datasets[0].data.shift();
            }

            distanceChart.update();  // refresh the chart
        }

        //code ends here
        requestAnimationFrame(update)
    }
}

update()






