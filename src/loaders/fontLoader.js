import { FontLoader } from "https://esm.run/three@0.160.0/examples/jsm/loaders/FontLoader.js";
import helvetica from "https://esm.run/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json";

export function loadFont() {
  const loader = new FontLoader()
  return loader.parse(helvetica)
}
