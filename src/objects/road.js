import * as THREE from "https://esm.run/three@0.160.0/build/three.module.js";

export function createRoad(box, size, scene) {
  const roadWidth = size.x * 2;
  const roadLength = size.z * 10;
  const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, 512, 1024);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8;
  const dashHeight = 160;
  const gap = 160;
  for (let y = 0; y < canvas.height; y += dashHeight + gap) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, y);
    ctx.lineTo(canvas.width / 2, y + dashHeight);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
  const road = new THREE.Mesh(geometry, material);
  road.rotation.x = -Math.PI / 2;
  road.position.y = box.min.y + 0.1;
  scene.add(road);
  window.__ROAD_TEXTURE__ = texture;
}
