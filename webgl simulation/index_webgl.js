import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { Particle } from "./Particles_webgl.js";
import { Vector2d, VectorMath as VM } from './Vectors_webgl.js';

// Scena
const scene = new THREE.Scene();

// Camera
const camera = new THREE.OrthographicCamera(
  -600,600,600,-600, 0.1, 1000
);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(600, 600);
document.body.appendChild(renderer.domElement);


// GENERATE PARTICLES
let particles = []
const size = 10
const N=size**2
for(let i=0; i<N;i++){
    const x = Math.random()
    const y = Math.random()
    const pos = new Vector2d(x,y)

    const vx = Math.random()
    const vy = Math.random()
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

const data = new Float32Array(size*size*4)

// CREATE TEXTURE
const texture = new THREE.DataTexture(
  data,
  size,
  size,
  THREE.RGBAFormat,
  THREE.FloatType
)
texture.needsUpdate = true

// UPDATE TEXTURE WITH PARTICLE's DATA

for(let i=0; i<N; i++){
  const particle = particles[i]

  const x = particle.pos.x1
  const y = particle.pos.y1
  const vx = particle.vel.x1
  const vy = particle.vel.y1

  const stride = i*4

  data[stride+0] = x
  data[stride+1] = y
  data[stride+2] = vx
  data[stride+3] = vy
}
texture.needsUpdate = true

// DEBUG (log and show the texture on a mesh)
console.log(texture)

const geo = new THREE.PlaneGeometry(2,2)
const mat = new THREE.MeshBasicMaterial({map:texture})
const quad = new THREE.Mesh(geo, mat)

const debugScene = new THREE.Scene()
debugScene.add(quad)

const debugCamera = new THREE.OrthographicCamera(-1,1,1,-1,0,10)
debugCamera.position.z = 1

renderer.render(debugScene, debugCamera)
console.log(data[0],data[1],data[2],data[3])



