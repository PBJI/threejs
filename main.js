// import * as THREE from "three";
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'https://esm.run/three@0.160.0/examples/jsm/controls/OrbitControls.js'
// So basically we are setting up a scene, a camera and a canvas (renderer) and an object
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Lighting is important loaded model
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
scene.add(hemiLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 10)
dirLight.position.set(2.5, 5, 7.5)
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight(0xffffff, 10)
dirLight2.position.set(-2.5, -5, -7.5)
scene.add(dirLight2)

const parts = []

// loading a pre-modeled car and setting the camera to show it as close as possible at appropriate angle
const loader = new GLTFLoader();
loader.load(
  "./car.glb",
  (gltf) => {
    const model = gltf.scene
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  model.position.sub(center)
  model.scale.set(1.5,1.5,1.5)
  scene.add(model)

  model.children[0].children[0].children[0].children.forEach((mesh) => {
    const original = mesh.position.clone()
    const direction = mesh.position.clone().sub(center).normalize()
    const distance = mesh.position.distanceTo(center)
    parts.push({ mesh, original, direction, distance })
  })
  const maxDim = Math.max(size.x, size.y, size.z)
  const camZ = maxDim
  camera.position.set(5, 2, camZ)
  camera.rotateX(-0.5)
  camera.rotateY(0.8)
  camera.rotateZ(0.4)
  },
  undefined,
  (error) => {
    console.error("GLB load error:", error);
  }
);

let scrollOffset = 0;
let startY = 0;

window.addEventListener("wheel", (e) => {
  e.preventDefault();
  scrollOffset += e.deltaY * 0.001;
  scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
}, { passive: false });

window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchmove", (e) => {
  const deltaY = e.touches[0].clientY - startY;
  scrollOffset -= deltaY * 0.003;
  scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
  startY = e.touches[0].clientY;
}, { passive: false });


scene.background = new THREE.Color(0xffffff)

function animate() {
  requestAnimationFrame(animate);

  parts.forEach((p) => {
    const moveAmount = p.distance * scrollOffset * 2
    const pos = p.original.clone().add(p.direction.clone().multiplyScalar(moveAmount))
    p.mesh.position.copy(pos)
  })

  controls.update();
  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;


animate();
