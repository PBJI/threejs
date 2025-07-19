import { renderer } from './src/core/renderer.js'
import { scene } from './src/core/scene.js'
import { camera } from './src/core/camera.js'
import { controls } from './src/core/controls.js'
import { addLights } from './src/core/lighting.js'
import { loadCarModel } from './src/loaders/carModelLoader.js'
import { setupEvents } from './src/utils/events.js'
import { animate } from './src/core/animate.js'
import { loadGuitarModel } from './src/loaders/guitarModeLoader.js'

addLights(scene)
loadCarModel(scene, camera)
loadGuitarModel(scene, camera)
setupEvents()
animate()
