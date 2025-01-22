import PocketBase from 'pocketbase';
import { WaitlistCollection } from './type';
import { create } from 'zustand/react';
import { Print } from '../utiils/utils';


export const pb = new PocketBase( import.meta.env.VITE_PB_URL );


interface WaitlistReturns {
  waitlist: WaitlistCollection;
  createWaitlist: ( { email, name, newsletter, role }: WaitlistCollection ) => void;
  status?: 'idle' | 'loading' | 'success' | 'error';
  setStatus?: ( status: 'idle' | 'loading' | 'success' | 'error' ) => void;
}

export const useCreateWaitlist = create<WaitlistReturns>( ( set ) => ( {
  // Waitlist data
  waitlist: {
    email: '',
    name: '',
    newsletter: true,
    role: '',
  }
  ,

  // setStatus function to update the status in other components
  setStatus: ( status: 'idle' | 'loading' | 'success' | 'error' ) => {
    set( { status: status } );
  },

  // createWaitlist function
  createWaitlist: async ( data: WaitlistCollection ) => {

    try {

      // Check if the data is valid
      if ( !data.email || !data.name || !data.role ) {
        Print( "Invalid data" );
        return;
      }

      const checkEmail = await pb.collection( 'WaitListUsers' ).getFullList(
        {
          filter: `email="${ data.email }"`
        }
      );

      if ( checkEmail.length > 0 ) {
        Print( "Email already exists" );
        set( ( state ) => ( { ...state, status: 'error' } ) );
        return;
      }
      // Check if the email is already in the waitlist

      // Create a new document in the 'WaitListUsers' collection
      await pb.collection( 'WaitListUsers' ).create( data );
      set( { waitlist: data } );
      Print( "Successfully created waitlist" );

    } catch ( error ) {
      Print( "Error creating waitlist", error );
    }
  },

  // Status of the waitlist
  status: 'idle',

} ) );
