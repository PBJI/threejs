import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";

export function loadAudio(path, model, loop = true) {
  return new Promise((resolve) => {
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(path, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(loop);
      sound.setRefDistance(10);
      sound.setVolume(1);
      // After loading via loadAudio

      resolve(sound);
      model.add(sound);
    });
  });
}
