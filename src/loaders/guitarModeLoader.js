import { GLTFLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/GLTFLoader";
import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
import { loaderOverlay } from "../dom/loading.js";
import { loadAudio } from "./audioLoader.js";

export async function loadGuitarModel(scene, camera) {
  const loader = new GLTFLoader();
  loader.load(
    "./models/guitar.glb",
    async (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      model.scale.set(3, 3, 3);
      scene.add(model);

      const sound = await loadAudio("./sounds/standard_strings.mp3", model, false);
      window.__GUITAR_BUFFER__ = sound.buffer;
      window.__GUITAR_LISTENER__ = sound.listener;
      window.__GUITAR_VOLUME__ = 1;
      window.__GUITAR_REF_DIST__ = 10;
      window.__GUITAR_SOUND__ = sound;
      const uiGroup = new THREE.Group();

      // 10% in from left and bottom edges
      const x = window.__ORTHO_CAMERA_LEFT__ + 0.1 * (window.__ORTHO_CAMERA_RIGHT__ - window.__ORTHO_CAMERA_LEFT__);
      const y = window.__ORTHO_CAMERA_BOTTOM__ + 0.1 * (window.__ORTHO_CAMERA_TOP__ - window.__ORTHO_CAMERA_BOTTOM__);

      const dist = -3; // negative Z in front of camera
      uiGroup.position.set(x * 1.2, y * 0.6, dist);
      uiGroup.add(model);

      // Attach to camera and camera to scene
      camera.add(uiGroup);
      scene.add(camera);

      // model.rotation.y = -Math.PI / 2;
      model.rotation.x = -Math.PI / 2;
      model.rotation.z = -Math.PI / 2 + 0.2;

      window.__GUITAR_MODEL__ = model;
      loaderOverlay.style.visibility = "hidden";
    },
    (xhr) => {
      loaderOverlay.style.visibility = "visible";
      loaderOverlay.innerText = "Guitar model: " + ((xhr.loaded / xhr.total) * 100).toFixed(2) + "% loaded";
    },
    (err) => {
      console.error(err);
      loaderOverlay.innerText = "Error loading car";
    }
  );
}
