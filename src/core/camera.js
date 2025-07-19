import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
const aspectRatio = window.innerWidth / window.innerHeight
window.__ORTHO_CAMERA_LEFT__ = -5 * aspectRatio
window.__ORTHO_CAMERA_RIGHT__ =  5 * aspectRatio
window.__ORTHO_CAMERA_TOP__ = 5
window.__ORTHO_CAMERA_BOTTOM__ = -5
window.__ORTHO_CAMERA_NEAR__ = 0.1
window.__ORTHO_CAMERA_FAR__ = 100
export const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 100)
camera.position.set(5, 2, 10);