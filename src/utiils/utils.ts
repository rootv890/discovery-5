export function randomRotate ( index: number, range: number ) {
  return index % 2 == 0 ? -range : range;
}
