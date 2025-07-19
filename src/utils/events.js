import { playSegment } from "./audio";
import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";


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

  const keyActions = {
    q: { offset: 0.5, duration: 3 },
    w: { offset: 19, duration: 3, move: '__CAR_FWD__' },
    e: { offset: 37.5, duration: 4 },
    a: { offset: 55, duration: 4, move: '__CAR_LFT__' },
    s: { offset: 72.5, duration: 3, move: '__CAR_BCK__' },
    d: { offset: 86.5, duration: 3, move: '__CAR_RHT__' }
  };
  
  window.addEventListener('keypress', (event) => {
    const key = event.key.toLowerCase();
    const action = keyActions[key];
    const guitarModel = window.__GUITAR_MODEL__;
    if (!action || !guitarModel) return;
    // Trigger car movement if specified
    if (action.move) {
      window[action.move] = 1;
    }
    // Play the specified audio segment
    playSegment(action.offset, action.duration, guitarModel);
  });
}  

if (window.__CAR_MODEL__ && !window.__CAR_TARGET_POS__) {
  window.__CAR_TARGET_POS__ = window.__CAR_MODEL__.position.clone();
} else if (!window.__CAR_TARGET_POS__) {
  window.__CAR_TARGET_POS__ = new THREE.Vector3();
}