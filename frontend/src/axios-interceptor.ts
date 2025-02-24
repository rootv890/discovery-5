
import { AxiosInstance } from "axios";
import { useAuthStore } from "./store/useAuthStore";



/**
 * Working Theory
 * AAI (Axios Auth Interceptor) is a security guard for
 * tokens which checks for access token validity.
 * if valid interceptor continues the request
 * if not it asks refresh token for a new access token
 * if refresh token is not valid it logs out the user
 * It happens with every request using Axios Instance
 */


// Flag to prevent concurrent token refresh requests
let isRefreshingToken = false;

// Queue to store failed requests
let refreshQueue: any[] = [];

export function setupAuthInterceptor ( axiosInstance: AxiosInstance ) {

  // Register a RESPONSE interceptor
  axiosInstance.interceptors.response.use(
    // success
    ( res ) => res,
    // Fail
    async ( err ) => {
      const oGRequest = err.config; // original request

      if ( err.response?.status === 401 && !oGRequest._retry && !isRefreshingToken ) {
        oGRequest._retry = true;
        isRefreshingToken = true;

        const authStore = useAuthStore.getState();
        const refreshResult = await authStore.refreshAccessToken();

        isRefreshingToken = false;

        if ( refreshResult ) {
          const newAccessToken = authStore.accessToken;
          oGRequest.headers.Authorization = `Bearer ${ newAccessToken }`;

          // Process queued requests
          refreshQueue.forEach( resolve => resolve() );
          refreshQueue = []; // Clear the queue

          // Return OG
          return axiosInstance( oGRequest );
        } else {
          // Token Refresh is Failed
          authStore.setIsLoggedIn( false );
          localStorage.removeItem( 'accessToken' );
          // Reject OG request 401
          return Promise.reject( err );
        }
      }

      // Error that is not 401
      return Promise.reject( err );

    }

  );

}
