import axios from "axios";

export const axiosInstance = axios.create( {
  baseURL: import.meta.env.VITE_BACKEND_AUTH_URL,
  withCredentials: true, // Include cookies in requests
} );
