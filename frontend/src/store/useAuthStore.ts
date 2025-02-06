import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "../services/axios";


interface LoginType {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  login: ( data: LoginType ) => Promise<boolean>;
  setIsLoggedIn: ( value: boolean ) => void;
  accessToken: string;
  setAccessToken: ( value: string ) => void;
  refreshAccessToken: () => Promise<boolean>;
  initialize: () => void; // to initialize the session from local storage
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>( ( set ): AuthState => {
  return {
    isLoggedIn: false,

    login: async ( data: LoginType ) => {
      try {
        const response = await axiosInstance.post( '/login', data );
        if ( response.status === 200 ) {
          const accessToken = response.data.accessToken;
          set( () => ( { accessToken: accessToken, isLoggedIn: true } ) );
          return true;
        } else {
          return false;
        }
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    setIsLoggedIn: ( value: boolean ) => set( () => ( { isLoggedIn: value } ) ),
    accessToken: "",

    setAccessToken: ( value: string ) =>
      set( () => {
        // sessionStorage.setItem("accessToken", value);
        localStorage.setItem( "accessToken", value );
        return { accessToken: value };
      } ),



    refreshAccessToken: async () => {
      try {
        // const response = await axios( `${ import.meta.env.VITE_BACKEND_AUTH_URL }/refresh-token` );
        const response = await axiosInstance.post( '/refresh-token' );
        const newAccessToken = response.data.accessToken;
        set( () => {
          localStorage.setItem( "accessToken", newAccessToken );
          return { accessToken: newAccessToken };
        } );
        return true; // Refresh successful
      } catch ( error ) {
        console.error( error );
        set( () => ( { isLoggedIn: false } ) );
        return false;
      }
    },

    initialize: () => {
      const accessToken = localStorage.getItem( "accessToken" );
      if ( accessToken ) {
        set( () => ( { accessToken: accessToken, isLoggedIn: true } ) );
      }
    },
    logout: async () => {

      try {
        // await axios( `${ import.meta.env.VITE_BACKEND_AUTH_URL }/logout` );
        await axiosInstance.post( '/logout' );


      } catch ( error ) {
        console.error( "Error during logout", error );
      }

      finally {
        localStorage.removeItem( "accessToken" );
        set( () => ( { accessToken: "", isLoggedIn: false } ) );
      }
    }
  };
} );
