
// All store types
export interface WaitlistEntryData {
  name: string;
  email: string;
  role: string;
  newsletter: boolean;
}

export interface WaitlistResponse {
  waitlist: WaitlistEntryData;
  createWaitlist: ( { email, name, newsletter, role }: WaitlistEntryData ) => Promise<boolean>;
  status?: 'idle' | 'loading' | 'success' | 'error';
  setStatus?: ( status: 'idle' | 'loading' | 'success' | 'error' ) => void;
}
