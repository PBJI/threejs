import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";


export function playSegment(offsetSec, durationSec, model) {
  const { buffer, listener } =
    window.__GUITAR_BUFFER__ !== undefined ? { buffer: window.__GUITAR_BUFFER__, listener: window.__GUITAR_LISTENER__ } : {};

  if (!buffer || !listener) return;

  const sound = new THREE.PositionalAudio(listener);
  sound.setBuffer(buffer);
  sound.setLoop(false);
  sound.setRefDistance(window.__GUITAR_REF_DIST__);
  sound.setVolume(window.__GUITAR_VOLUME__);
  model.add(sound);

  const source = sound.context.createBufferSource();
  source.buffer = buffer;
  source.loop = false;
  source.connect(sound.gain);
  source.start(0, offsetSec, durationSec);

  sound.source = source;
}
