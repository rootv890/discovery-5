export function randomRotate ( index: number, range: number ) {
  return index % 2 == 0 ? -range : range;
}
export function capitalize ( str: string ) {
  return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

export function wait ( ms: number ) {
  return new Promise( ( resolve ) => {
    return setTimeout( resolve, ms );
  } );
}


import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn ( ...input: ClassValue[] ) {
  return twMerge( clsx( ...input ) );
}


export function Print ( ...args: any[] ) {
  if ( import.meta.env.MODE === 'development' ) {
    console.log( ...args );
  }
  else {
    return;
  }
}
