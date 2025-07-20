import { GLTFLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/GLTFLoader";
import { createRoad } from "../objects/road.js";
import { createLabels } from "../objects/labels.js";
import { loadFont } from "./fontLoader.js";
import { loadAudio } from "./audioLoader.js";
import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";
import { loaderOverlay } from "../dom/loading.js";

export async function loadModel(scene, camera) {
  const loader = new GLTFLoader();
  loader.load(
    "./models/car.glb",
    async (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);
      const sound = await loadAudio(model);
      const font = await loadFont();
      const parts = createLabels(model, font, scene, center);
      createRoad(box, size, scene);
      const maxDim = Math.max(size.x, size.y, size.z);
      const camZ = maxDim;
      camera.position.set(5, 2, camZ);
      camera.rotateX(-0.5);
      camera.rotateY(0.8);
      camera.rotateZ(0.4);
      model.rotateY(-0.1);
      camera.position.set(5, 2, camZ);
      window.__CAR_PARTS__ = parts;
      window.__CAR_SOUND__ = sound;
      window.__CAR_MODEL__ = model;
      document.body.removeChild(loaderOverlay);
    },
    (xhr) => {
      loaderOverlay.innerText = ((xhr.loaded / xhr.total) * 100).toFixed(2) + "% loaded";
    },
    (err) => {
      console.error(err);
      loaderOverlay.innerText = "Error loading car";
    }
  );
}
