import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
export function addLights(scene) {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 10);
  dirLight.position.set(2.5, 5, 7.5);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 10);
  dirLight2.position.set(-2.5, -5, -7.5);
  scene.add(dirLight2);
}
