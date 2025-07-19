import { renderer } from './src/core/renderer'
import { scene } from './src/core/scene'
import { camera } from './src/core/camera'
import { controls } from './src/core/controls'
import { addLights } from './src/core/lighting'
import { loadModel } from './src/loaders/modelLoader'
import { setupEvents } from './src/utils/events'
import { animate } from './src/core/animate'

addLights(scene)
loadModel(scene, camera)
setupEvents()
animate()
