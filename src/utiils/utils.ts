export function randomRotate ( index: number, range: number ) {
  return index % 2 == 0 ? -range : range;
}


export function wait ( ms: number ) {
  return new Promise( ( resolve ) => {
    return setTimeout( resolve, ms );
  } );
}
