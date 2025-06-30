import * as THREE from 'three'

// So basically we are setting up a scene, a camera and a canvas (renderer)
const scene = new THREE.Scene()

// Currently the field of view is capturing enough of the cube and it's surrounding depending on z value defined for cube below.
// So the wider the fov goes, the more close the camera needs to be to be able to see cube in big size.
// And the narrower the fov goes, the more far the camera needs to be able to see cube in small size.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Then we are creating an object where we define it's geometry and material before adding it to the above scene
const geometry = new THREE.BoxGeometry()
const material = new THREE.PointsMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// This value allows us to control the cameras distance from z axis I suppose, which means the camera currently is at x = 0 and y = 0
camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
  // And we are rotating the cube by small delta value each repaint.
  // However the speed of animation will differ depending on the refresh rate of the display I suppose
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}

// Using actual time passed after each frame will help make the animation consistent across different types of display.
// So it can be demonstrated using a second cube comparing with the previous cube's animation

const geometry2 = new THREE.BoxGeometry()
const material2 = new THREE.PointsMaterial({ color: 0x0000ff })
const cube2 = new THREE.Mesh(geometry2, material2)
scene.add(cube2)


let prevTime = performance.now()

function animate2() {
  requestAnimationFrame(animate2)
  const currentTime = performance.now()
  const delta = (currentTime - prevTime) / 1000
  prevTime = currentTime
  cube2.rotation.x += delta * 1
  cube2.rotation.y += delta * 1
  renderer.render(scene, camera)
}


animate()
animate2()
