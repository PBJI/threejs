import { renderer } from './src/core/renderer.js'
import { scene } from './src/core/scene.js'
import { camera } from './src/core/camera.js'
import { controls } from './src/core/controls.js'
import { addLights } from './src/core/lighting.js'
import { loadModel } from './src/loaders/modelLoader.js'
import { setupEvents } from './src/utils/events.js'
import { animate } from './src/core/animate.js'

addLights(scene)
loadModel(scene, camera)
setupEvents()
animate()
