import { create } from 'zustand';
import { NewsletterPreference, WaitlistUserRoleType, WaitlistUserTable } from '../drizzle/schema';
import { Print } from '../utils/utils';
import { db } from '../db';


export interface WaitlistEntryData {
  name: string;
  email: string;
  role: WaitlistUserRoleType;
  newsletter: boolean;
}

export interface WaitlistResponse {
  waitlist: WaitlistEntryData;
  createWaitlist: ( { email, name, newsletter, role }: WaitlistEntryData ) => Promise<boolean>;
}


export const useWaitlistStoreBeta = create<WaitlistResponse>( ( set ): WaitlistResponse => {


  return {

    // Default values
    waitlist: {
      email: '',
      name: '',
      newsletter: false,
      role: 'designer'
    }

    ,
    createWaitlist: async ( data: WaitlistEntryData ): Promise<boolean> => {
      // check data validation
      try {
        if ( !data.email || !data.name || !data.role ) {
          Print( "Invalid data" );
          return false;
        }

        // check email duplication

        // add to database
        const user = await db.insert( WaitlistUserTable ).values( {
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: new Date(),
          updatedAt: new Date()
        } ).returning( {
          id: WaitlistUserTable.id,
        } );

        // add newsletter preference
        if ( user.length === 0 ) {
          Print( "Error adding user" );
          return false;
        }

        await db.insert( NewsletterPreference ).values( {
          userId: user[ 0 ].id,
          newsletter: data.newsletter
        } );

        // set the waitlist
        set( { waitlist: data } );

        return true;
      } catch ( error ) {
        Print( error );
        return false;
      }
    }

  };

} );
