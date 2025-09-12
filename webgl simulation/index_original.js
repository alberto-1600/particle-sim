// Scena
const scene = new THREE.Scene();

// Camera
const camera = new THREE.OrthographicCamera(
  0,600,600,0, 0.1, 1000
);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(600, 600);
document.body.appendChild(renderer.domElement);

//test
import { Particle } from "./Particles_webgl.js";
import { Vector2d, VectorMath as VM, VectorPolar } from "./Vectors_webgl.js";

const particles = []

const N=1000
for(let i=0; i<N;i++){
    const x = Math.random()*(500)+50
    const y = Math.random()*(500)+50
    const pos = new Vector2d(x,y)

    const vx = (Math.random()-0.5)*10
    const vy = (Math.random()-0.5)*10
    const vel = new Vector2d(vx,vy)

    const ax = 0
    const ay = 0
    const acc = new Vector2d(ax,ay)

    const r = 2
    const color = "#0000ff"

    const p_elasticity = 0.99
    const w_elasticity = new Vector2d(1,1)

    const p = new Particle(pos,vel,acc,r,color,p_elasticity, w_elasticity)
    particles.push(p)
}

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles.length * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.forEach(p => {
  positions.push(p.pos.x1, p.pos.y1, 0);
});


const material = new THREE.PointsMaterial({ size: 2, color: 0xffffff });

const points = new THREE.Points(geometry, material);
scene.add(points);


//function to separate physics handling from drawing
function update_physics(){
    let filtered_clumps = {}
    const steps = 8
    const column_width = 40// particles[0].r*2
    const row_height = 40// particles[0].r*2

    // 0. substeps for loop
    for (let step = 0; step < steps; step++) {
        filtered_clumps = {}
        // 1. reset accelerations
        for (let i=0; i<particles.length; i++) {
            const p=particles[i]
            p.acc.x1 = 0;
            p.acc.y1 = 0.08;
        }

        // ADD ALL FORCES FROM HERE...
        for (let i=0; i<springs.length; i++){
            s = springs[i]
            s.add_spring_forces_to_particles()
        }

        // 2. apply forces & collisions

        //filter particles
        for(let i=0; i<particles.length; i++){
            const p = particles[i]
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
        for (let i=0; i<particles.length; i++) {
            const p = particles[i]
            p.update_position(1/steps); // dt = 0.1
        }
    }
}


function update_simulation(){
    //run physics
    update_physics()

    //update positions
    for(let i=0; i<particles.length; i++){
        const p=particles[i]
        positions[i * 3] = p.pos.x1
        positions[i * 3 +1] = p.pos.y1
        positions[i * 3 +2] = 0
    }
    geometry.attributes.position.needsUpdate = true

    //draw
    renderer.render(scene, camera);
    requestAnimationFrame(update_simulation)
}

update_simulation()






