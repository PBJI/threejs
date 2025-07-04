// import * as THREE from "three";
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

// So basically we are setting up a scene, a camera and a canvas (renderer) and an object
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the camera at proper angle
camera.position.z = 6;
camera.position.y = -5;
camera.position.x = -5;
camera.rotateX(0.6);
camera.rotateY(-0.5);
camera.rotateZ(-0.5);


// A function that renders a car like shape made by using cubes
function renderCar() {
  const car = new THREE.Group();
  const parts = [];

  const center = new THREE.Vector3();

  // Car base cubes
  for (let i = 0; i < 3 * 5; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.PointsMaterial({ color: 0x00ffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = Math.floor(i / 3) - 5 / 2;
    cube.position.y = (i % 3) - 3 / 2;
    car.add(cube);
  }

  // Cars tires cubes
  const frontTiresDistance = 1;
  const backTiresDistance = 1;
  for (let i = 0; i < 3 * 5; i++) {
    if ((i % 3 == 2 || i % 3 == 0) && (Math.floor(i / 3) == frontTiresDistance || 4 - Math.floor(i / 3) == backTiresDistance)) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.PointsMaterial({ color: 0xff00ff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = Math.floor(i / 3) - 5 / 2;
      cube.position.y = (i % 3) - 3 / 2;
      cube.position.z = -1;
      car.add(cube);
    }
  }

  // Cars top cubes
  for (let i = 0; i < 3 * 5; i++) {
    if (!(Math.floor(i / 3) == frontTiresDistance - 1 || 5 - Math.floor(i / 3) == backTiresDistance)) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.PointsMaterial({ color: 0xffff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = Math.floor(i / 3) - 5 / 2;
      cube.position.y = (i % 3) - 3 / 2;
      cube.position.z = 1;
      car.add(cube);
    }
  }

  const box = new THREE.Box3().setFromObject(car);
  box.getCenter(center); // Gets the center of the bounding box and saves it to center object

  car.children.forEach((mesh) => {
    const original = mesh.position.clone();
    const direction = mesh.position.clone().sub(center).normalize();
    const distance = mesh.position.distanceTo(center);
    parts.push({ mesh, original, direction, distance });
  });

  return { car, parts };
}

let { car, parts } = renderCar();

scene.add(car);

let scrollOffset = 0;

window.addEventListener('wheel', (e) => {
  scrollOffset += e.deltaY * 0.001;
  scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
});


function animate() {
  requestAnimationFrame(animate);
  parts.forEach((p) => {
    // The larger the distance between the center of the car and part, the more speed by which it will travel away.
    const moveAmount = p.distance * scrollOffset * 2;
    const pos = p.original.clone().add(p.direction.clone().multiplyScalar(moveAmount));
    p.mesh.position.copy(pos);
  });

  // car.rotation.x += 0.01
  car.rotation.z += 0.01
  // car.rotation.y += 0.01

  renderer.render(scene, camera);
}

animate();

