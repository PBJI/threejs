import { renderer } from "./renderer.js";
import { scene } from "./scene.js";
import { camera } from "./camera.js";
import { controls } from "./controls.js";

export function animate() {
  requestAnimationFrame(animate);
  const parts = window.__CAR_PARTS__ || [];
  const sound = window.__CAR_SOUND__;
  const roadTexture = window.__ROAD_TEXTURE__;

  const tires = ["Circle038_1", "Circle050_51", "Circle037_2", "Circle051_37"];
  const scrollOffset = window.__SCROLL__ || 0;

  parts.forEach((p) => {
    if (tires.includes(p.name)) p.mesh.rotateX(0.3);
    const pos = p.original.clone().add(p.direction.clone().multiplyScalar(p.distance * scrollOffset * 2));
    p.mesh.position.lerp(pos, 0.1);
    p.textMesh.position.lerp(pos, 0.1);
  });

  if (sound) sound.setPlaybackRate(Math.abs(1 - scrollOffset / 2));
  if (roadTexture) {
    roadTexture.offset.y -= 0.1 * (1 - scrollOffset);
    roadTexture.offset.x -= 0.01 * (1 - scrollOffset);
  }

  controls.update();
  renderer.render(scene, camera);
}
