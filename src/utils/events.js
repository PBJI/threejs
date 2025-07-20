import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
import { camera } from "../core/camera";
import { scene } from "../core/scene";
import { controls } from "../core/controls";

export function setupEvents() {
  window.__SCROLL__ = 0;
  let startY = 0;

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      window.__SCROLL__ += e.deltaY * 0.001;
      //   window.__SCROLL__ = Math.max(0, Math.min(window.__SCROLL__, 1))
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
      window.__SCROLL__ -= deltaY * 0.003;
      //   window.__SCROLL__ = Math.max(0, Math.min(window.__SCROLL__, 1))
      startY = e.touches[0].clientY;
    },
    { passive: false }
  );

  window.addEventListener("click", () => {
    const sound = window.__CAR_SOUND__;
    if (sound && !sound.isPlaying) sound.play();
  });
}

// Object selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;

window.addEventListener("click", (e) => {
  if (selectedObject) {
    selectedObject.material.emissive.set(0x000000);
  }
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  selectedObject = intersects.length > 0 ? intersects[0].object : null;
  if (selectedObject) {
    selectedObject.material.emissive = new THREE.Color(0xffff00);
    window.__SELECTED_OBJECT__ = selectedObject;
  }
});
