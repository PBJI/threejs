import { TextGeometry } from "https://esm.run/three@0.160.0/examples/jsm/geometries/TextGeometry.js";
import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";

export function createLabels(model, font, scene, center) {
  const parts = [];
  model.children[0].children[0].children[0].children.forEach((mesh) => {
    const original = mesh.position.clone();
    const direction = mesh.position.clone().sub(center).normalize();
    const distance = mesh.position.distanceTo(center);
    if (direction.y < 0) {
      direction.y = 0;
    }
    // const geometry = new TextGeometry(mesh.name || "Unnamed", { font, size: 0.1, steps: 0, depth: 0, curveSegments: 12, bevelEnabled: false });
    // const material = new THREE.MeshToonMaterial({ color: 0x000000 });
    // const textMesh = new THREE.Mesh(geometry, material);
    // const offset = direction.clone().multiplyScalar(0.5);
    // textMesh.position.copy(mesh.position.clone().add(offset));
    // scene.add(textMesh);
    parts.push({
      mesh,
      original,
      direction,
      distance,
      // textMesh, 
      name: mesh.name
    });
  });
  return parts;
}
