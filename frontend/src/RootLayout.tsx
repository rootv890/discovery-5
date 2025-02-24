import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { setupAuthInterceptor } from "./axios-interceptor";
import { axiosInstance } from "./services/axios";

const RootLayout = () => {
  // RUn the useEffect hook here
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const init = authStore.initialize;
  useEffect(() => {
    setupAuthInterceptor(axiosInstance);
    init();
  }, [init, isLoggedIn]);

  return (
    <div className="">
      {/* <h1>Root Layout</h1> */}

      <Outlet />
    </div>
  );
};

export default RootLayout;
