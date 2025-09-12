import * as THREE from "https://unpkg.com/three@0.156.1/build/three.module.js";

// CREATE TEXTURE WITH PARTICLES x,y,vx,vy
const size = 10
const N=size**2

const data = new Float32Array(size*size*4)

for(let i=0; i<N; i++){
  const x = Math.random()
  const y = Math.random()
  const vx = Math.random()
  const vy = Math.random()

  const stride = i*4

  data[stride+0] = x
  data[stride+1] = y
  data[stride+2] = vx
  data[stride+3] = vy
}

const texture = new THREE.DataTexture(
  data,
  size,
  size,
  THREE.RGBAFormat,
  THREE.FloatType
)
texture.needsUpdate = true







//DEFINE GLSL SHADERS
const simVertShader = `
  void main(){
    gl_Position = vec4(position, 1.0);
  }
`;

const simFragShader = `
  #version 300 es
  precision highp float;

  uniform sampler2D uState;
  uniform vec2 uBounds;
  uniform float uDelta;

  out vec4 fragColor;

  void main(){
    ivec2 uvInt = ivec2(gl_FragCoord.xy);
    vec4 state = texelFetch(uState, uvInt, 0);

    vec2 pos = state.xy;
    vec2 vel = state.zw;

    // integrate
    pos += vel*uDelta;

    //border collision
    if (pos.x < -uBounds.x || pos.x > uBounds.x) vel.x *= -1.0;
    if (pos.y < -uBounds.y || pos.y > uBounds.y) vel.y *= -1.0;

    //write out new state
    gl_FragColor = vec4(pos, vel);
  }
`;








//CREATE THE NEW MATERIAL WITH THE SHADERS
const simMat = new THREE.ShaderMaterial({
  vertexShader: simVertShader,
  fragmentShader: simFragShader,
  uniforms:{
    uState: {value: null},
    uBounds: {value: new THREE.Vector2(1,1)},
    uDelta: {value: 0.016}
  }
})






// CREATE RENDERER AND SCENE AND RENDER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// enable floating point textures
renderer.capabilities.getMaxAnisotropy();

const options = {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  type: THREE.FloatType,
  format: THREE.RGBAFormat,
  depthBuffer: false,
  stencilBuffer: false
};

const rt1 = new THREE.WebGLRenderTarget(size, size, options)
const rt2 = new THREE.WebGLRenderTarget(size, size, options)

let currentRT = rt1;
let nextRT = rt2;

const simScene = new THREE.Scene();
const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), simMat)
simScene.add(simQuad);

const simCam = new THREE.Camera();

renderer.setRenderTarget(nextRT);
renderer.render(simScene, simCam);
renderer.setRenderTarget(null);

// swap
[ currentRT, nextRT ] = [ nextRT, currentRT ];
simMat.uniforms.uState.value = currentRT.texture;


/*
DEBUG (log and show the texture on a mesh)
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
*/


