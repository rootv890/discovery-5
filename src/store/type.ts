
// All store types
export interface WaitlistEntryData {
  name: string;
  email: string;
  role: string;
  newsletter: boolean;
}

export interface WaitlistResponse {
  waitlist: WaitlistEntryData;
<<<<<<< HEAD
  createWaitlist: ( { email, name, newsletter, role }: WaitlistEntryData ) => Promise<boolean>;
=======
  createWaitlist: ( { email, name, newsletter, role }: WaitlistEntryData ) => boolean;
>>>>>>> 019cd8b92ff23b3498476d1bc9bfd900fbcca4a8
  status?: 'idle' | 'loading' | 'success' | 'error';
  setStatus?: ( status: 'idle' | 'loading' | 'success' | 'error' ) => void;
}
