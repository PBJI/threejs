import { OrbitControls } from 'https://esm.run/three@0.160.0/examples/jsm/controls/OrbitControls.js'
import { camera } from './camera.js'
import { renderer } from './renderer.js'
export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = true
controls.enablePan = true
controls.enableDamping = true
controls.dampingFactor = 0.2
