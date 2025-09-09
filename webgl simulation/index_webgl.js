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

// Geometria del cerchio (raggio, segmenti)
const geometry = new THREE.CircleGeometry(10, 12); // raggio 2, 64 segmenti
const material = new THREE.MeshBasicMaterial({ color: 0x3399ff });
const circle = new THREE.Mesh(geometry, material);

scene.add(circle);

// Funzione di rendering
function animate() {
  requestAnimationFrame(animate);

  // esempio: rotazione
  circle.position.x = 0;
  

  renderer.render(scene, camera);
}
animate();