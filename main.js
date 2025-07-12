const loaderOverlay = document.createElement('div');
loaderOverlay.style.position = 'fixed';
loaderOverlay.style.top = '0';
loaderOverlay.style.left = '0';
loaderOverlay.style.width = '100vw';
loaderOverlay.style.height = '100vh';
loaderOverlay.style.background = '#ffffff';
loaderOverlay.style.display = 'flex';
loaderOverlay.style.alignItems = 'center';
loaderOverlay.style.justifyContent = 'center';
loaderOverlay.style.fontSize = '2rem';
loaderOverlay.style.fontFamily = 'sans-serif';
loaderOverlay.style.zIndex = '999';
loaderOverlay.innerText = 'Loading...';

import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

let scrollOffset =0;

document.body.appendChild(loaderOverlay);
//Create scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//lights 
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 10);
dirLight.position.set(2.5, 5, 7.5);
scene.add(dirLight);

//storing mesh parts for later use
const partsOfCar = [];

//Load the car model
const loader = new GLTFLoader();
loader.load('./car.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);

  //Setting center of the model
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
	model.position.sub(center)
  // Traverse all child objects in the model and saving details 
  model.traverse((child) => {
      const original = child.position.clone();                 
      const direction = original.clone().sub(center).normalize();
      const distance = original.distanceTo(center);             
      partsOfCar.push({ mesh: child, original, direction, distance });
  });

  // Add the model to the scene
  scene.add(model);
	//removing loader
	document.body.removeChild(loaderOverlay)
console.log(gltf.scene)

}, undefined, (error) => {
  console.log("An error occurred loading the model:", error);
	document.body.removeChild(loaderOverlay)
});



// const loader = new GLTFLoader();
// loader.load(
//   "./car.glb",
//   (gltf) => {
//     const model = gltf.scene
//   const box = new THREE.Box3().setFromObject(model)
//   const center = box.getCenter(new THREE.Vector3())
//   const size = box.getSize(new THREE.Vector3())
//   model.position.sub(center)
//   model.scale.set(1.5,1.5,1.5)
//   scene.add(model)
//
//   document.body.removeChild(loaderOverlay)
//
//   model.children[0].children[0].children[0].children.forEach((mesh) => {
//     const original = mesh.position.clone()
//     const direction = mesh.position.clone().sub(center).normalize()
//     const distance = mesh.position.distanceTo(center)
//     parts.push({ mesh, original, direction, distance })
//   })
//   const maxDim = Math.max(size.x, size.y, size.z)
//   const camZ = maxDim
//   camera.position.set(5, 2, camZ)
//   camera.rotateX(-0.5)
//   camera.rotateY(0.8)
//   camera.rotateZ(0.4)
//   },
//   undefined,
//   (error) => {
//     console.error("GLB load error:", error);
//     document.body.removeChild(loaderOverlay)
//   }
// );

//event listener
window.addEventListener("wheel", (e)=>{
  e.preventDefault();
	scrollOffset=scrollOffset+e.deltaY*0.001
},{passive:false})

window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchmove", (e) => {
  const deltaY = e.touches[0].clientY - startY;
  scrollOffset -= deltaY * 0.003;
  scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
  startY = e.touches[0].clientY;
}, { passive: false });


// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom=false

//Animation loop
function animate() {
  requestAnimationFrame(animate);

	//animate based on scroll
	partsOfCar.forEach((part)=>{
    const moveAmount=part.distance*scrollOffset*0.2
		const pos = part.original.clone().add(part.direction.clone().multiplyScalar(moveAmount))
		part.mesh.position.copy(pos)
	})

  controls.update();
  renderer.render(scene, camera);
}

animate();
