import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
