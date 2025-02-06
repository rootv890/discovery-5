import { create } from "zustand";

export interface AuthState {
  // isSignedIn: boolean;
  // setIsSignedIn: (value: boolean) => void;
  // isLoggedIn: boolean;
  // setIsLoggedIn: (value: boolean) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set): AuthState => {
  return {
    // isSignedIn: false,
    // setIsSignedIn: (value: boolean) => set(() => ({ isSignedIn: value })),
    // isLoggedIn: false,
    // setIsLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value })),
    accessToken: "",
    setAccessToken: (value: string) => set(() => ({ accessToken: value })),
  };
});
