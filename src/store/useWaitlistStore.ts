import PocketBase from 'pocketbase';
import { WaitlistEntryData, WaitlistResponse } from './type';
import { create } from 'zustand/react';
import { Print } from '../utils/utils';

export const pb = new PocketBase( import.meta.env.VITE_PB_URL );



export const useWaitlistStore = create<WaitlistResponse>( ( set ) => ( {
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
  createWaitlist: async ( data: WaitlistEntryData ) => {

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
