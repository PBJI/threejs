// import * as THREE from "three";
const loaderOverlay = document.createElement("div");
loaderOverlay.style.position = "fixed";
loaderOverlay.style.top = "0";
loaderOverlay.style.left = "0";
loaderOverlay.style.width = "100vw";
loaderOverlay.style.height = "100vh";
loaderOverlay.style.background = "#ffffff";
loaderOverlay.style.display = "flex";
loaderOverlay.style.alignItems = "center";
loaderOverlay.style.justifyContent = "center";
loaderOverlay.style.fontSize = "2rem";
loaderOverlay.style.fontFamily = "sans-serif";
loaderOverlay.style.zIndex = "999";
loaderOverlay.innerText = "Loading...";
document.body.appendChild(loaderOverlay);

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "https://esm.run/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "https://esm.run/three@0.160.0/examples/jsm/geometries/TextGeometry.js";
import helvetica from "https://esm.run/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json";
// So basically we are setting up a scene, a camera and a canvas (renderer) and an object
const scene = new THREE.Scene();
let aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textloader = new FontLoader();

const font = textloader.parse(helvetica);

// Lighting is important loaded model
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 10);
dirLight.position.set(2.5, 5, 7.5);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 10);
dirLight2.position.set(-2.5, -5, -7.5);
scene.add(dirLight2);

const parts = [];
let roadTexture;

const listener = new THREE.AudioListener();
camera.add(listener);

const carSound = new THREE.PositionalAudio(listener);

const audioLoader = new THREE.AudioLoader();

audioLoader.load("./engine.mp3", function (buffer) {
  carSound.setBuffer(buffer);
  carSound.setLoop(true);
  carSound.setRefDistance(10);
  carSound.setVolume(1);
  carSound.set;
});
// loading a pre-modeled car and setting the camera to show it as close as possible at appropriate angle
const loader = new GLTFLoader();
loader.load(
  "./output.glb",
  (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    scene.add(model);

    const roadWidth = size.x * 2;
    const roadLength = size.z * 10;
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8;
    const dashHeight = 160;
    const gap = 160;
    for (let y = 0; y < canvas.height; y += dashHeight + gap) {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, y);
      ctx.lineTo(canvas.width / 2, y + dashHeight);
      ctx.stroke();
    }

    roadTexture = new THREE.CanvasTexture(canvas);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 4);

    const roadMaterial = new THREE.MeshStandardMaterial({
      map: roadTexture,
      side: THREE.DoubleSide,
    });

    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = box.min.y - 1;
    scene.add(road);

    document.body.removeChild(loaderOverlay);

    console.log(model.children[0].children[0].children[0].children);

    model.children[0].children[0].children[0].children.forEach((mesh) => {
      const original = mesh.position.clone();
      const direction = mesh.position.clone().sub(center).normalize();
      const distance = mesh.position.distanceTo(center);

      if (direction.y < 0) {
        direction.y = 0;
      }

      const name = mesh.name || "Unnamed";
      const geometry = new TextGeometry(name, {
        font,
        size: 0.05,
        steps: 0,
        depth: 0,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const material = new THREE.MeshToonMaterial({ color: 0x000000, side: THREE.FrontSide });
      const textMesh = new THREE.Mesh(geometry, material);

      const textOffset = direction.clone().multiplyScalar(0.5);
      textMesh.position.copy(mesh.position.clone().add(textOffset));
      scene.add(textMesh);
      parts.push({ mesh, original, direction, distance, textMesh, name: mesh.name });
    });

    const maxDim = Math.max(size.x, size.y, size.z);
    const camZ = maxDim;
    camera.position.set(5, 2, camZ);
    camera.rotateX(-0.5);
    camera.rotateY(0.8);
    camera.rotateZ(0.4);

    model.add(carSound);
    model.rotateY(-0.1)
  },
  undefined,
  (error) => {
    console.error("GLB load error:", error);
    document.body.removeChild(loaderOverlay);
  }
);

window.addEventListener("click", () => {
  if (!carSound.isPlaying) carSound.play();
});

let scrollOffset = 0;
let startY = 0;

window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    scrollOffset += e.deltaY * 0.001;
    // scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
  },
  { passive: false }
);

window.addEventListener(
  "touchstart",
  (e) => {
    startY = e.touches[0].clientY;
  },
  { passive: false }
);

window.addEventListener(
  "touchmove",
  (e) => {
    const deltaY = e.touches[0].clientY - startY;
    scrollOffset -= deltaY * 0.003;
    // scrollOffset = Math.max(0, Math.min(scrollOffset, 1));
    startY = e.touches[0].clientY;
  },
  { passive: false }
);

scene.background = new THREE.Color(0xffffff);

function animate() {
  requestAnimationFrame(animate);
  const tires = ["Circle038_1", "Circle050_51", "Circle037_2", "Circle051_37"];
  parts.forEach((p) => {
    if (tires.includes(p.name)) {
      p.mesh.rotateX(0.3);
    }
    const moveAmount = p.distance * scrollOffset * 2;
    const pos = p.original.clone().add(p.direction.clone().multiplyScalar(moveAmount));
    p.mesh.position.lerp(pos, 0.1);
    p.textMesh.position.lerp(pos, 0.1);
    carSound.setPlaybackRate(Math.abs(1 - scrollOffset / 2));
  });
  roadTexture.offset.y -= 0.1 * Math.abs(1 - scrollOffset);
  roadTexture.offset.x = roadTexture.offset.x - 0.01 * Math.abs(1 - scrollOffset);

  controls.update();
  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

animate();
