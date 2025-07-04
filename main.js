import * as THREE from "three";

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
// A function that renders a car like shape made by using and cubes just spread out

function renderCar() {
  const car = new THREE.Group();
  const parts = [];

  const center = new THREE.Vector3();
  const tempVec = new THREE.Vector3();

  for (let i = 0; i < 3 * 5; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.PointsMaterial({ color: 0x00ffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = Math.floor(i / 3) - 5 / 2;
    cube.position.y = (i % 3) - 3 / 2;
    car.add(cube);
  }

  const frontTiresDistance = 1;
  const backTiresDistance = 1;
  for (let i = 0; i < 3 * 5; i++) {
    if ((i % 3 == 1 || i % 3 == 0) && (Math.floor(i / 3) == frontTiresDistance || 4 - Math.floor(i / 3) == backTiresDistance)) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.PointsMaterial({ color: 0xff00ff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = Math.floor(i / 3) - 5 / 2;
      cube.position.y = (i % 3) - 3 / 2;
      cube.position.z = -1;
      car.add(cube);
    }
  }

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
  box.getCenter(center);

  car.children.forEach((mesh) => {
    const original = mesh.position.clone();
    const direction = mesh.position.clone().sub(center).normalize();
    const distance = mesh.position.distanceTo(center);
    parts.push({ mesh, original, direction, distance });
  });

  return { car, parts };
}

let { car, parts } = renderCar();
let exploding = false;
let explodeStartTime = 0;

function triggerExplosion() {
  exploding = true;
  explodeStartTime = performance.now();
}

function resetCarParts() {
  parts.forEach((p) => {
    p.mesh.position.copy(p.original);
  });
  exploding = false;
}

let prevTime = performance.now();
let phaseStartTime = prevTime;
let phase = 'rest';

scene.add(car);

function animate() {
  requestAnimationFrame(animate);
  const currentTime = performance.now();
  prevTime = currentTime;
  const t = (currentTime - phaseStartTime) / 1000;

  if (phase === 'rest') {
    if (t >= 1) {
      phase = 'explode';
      phaseStartTime = currentTime;
    }
  } else if (phase === 'explode') {
    if (t <= 1) {
      parts.forEach((p) => {
        const moveAmount = p.distance * t * 2;
        const pos = p.original.clone().add(p.direction.clone().multiplyScalar(moveAmount));
        p.mesh.position.copy(pos);
      });
    } else {
      resetCarParts();
      phase = 'rest';
      phaseStartTime = currentTime;
    }
  }

  renderer.render(scene, camera);
}

animate();

