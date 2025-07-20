export function isDescendantOf(object, targetParent) {
  let current = object;
  while (current) {
    if (current === targetParent) return true;
    current = current.parent;
  }
  return false;
}
