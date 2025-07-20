import { renderer } from "./renderer.js";
import { scene } from "./scene.js";
import { camera } from "./camera.js";
import { controls } from "./controls.js";
import { isDescendantOf } from "../utils/objects.js";

export function animate() {
  requestAnimationFrame(animate);
  const parts = window.__CAR_PARTS__ || [];
  const sound = window.__CAR_SOUND__;
  const roadTexture = window.__ROAD_TEXTURE__;

  const tires = ["Circle038_1", "Circle050_51", "Circle037_2", "Circle051_37"];
  const scrollOffset = window.__SCROLL__ || 0;

  const selected = window.__SELECTED_OBJECT__;
  const carRoot = window.__CAR_MODEL__;

  const shouldDisassemble = selected && isDescendantOf(selected, carRoot);

  if (shouldDisassemble) {
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.dampingFactor = 0.000001;
    parts.forEach((p) => {
      if (!isDescendantOf(p.mesh, carRoot)) return;

      if (tires.includes(p.name)) p.mesh.rotateX(0.3);
      const pos = p.original.clone().add(p.direction.clone().multiplyScalar(p.distance * scrollOffset * 2));
      p.mesh.position.lerp(pos, 0.1);
      p.textMesh.position.lerp(pos, 0.1);
    });
    if (sound) sound.setPlaybackRate(Math.abs(1 - scrollOffset / 2));
  } else {
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.dampingFactor = 0.2;
  }
  if (roadTexture) {
    roadTexture.offset.y -= 0.1 * (1 - scrollOffset);
    roadTexture.offset.x -= 0.01 * (1 - scrollOffset);
  }

  controls.update();
  renderer.render(scene, camera);
}
