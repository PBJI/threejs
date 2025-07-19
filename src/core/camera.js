import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
const aspectRatio = window.innerWidth / window.innerHeight
export const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 100)
camera.position.set(5, 2, 10);