import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";

export function loadAudio(model) {
  return new Promise((resolve) => {
    const listener = new THREE.AudioListener()
    const sound = new THREE.PositionalAudio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('./engine.mp3', (buffer) => {
      sound.setBuffer(buffer)
      sound.setLoop(true)
      sound.setRefDistance(10)
      sound.setVolume(1)
      resolve(sound)
      model.add(sound)
    })
  })
}
