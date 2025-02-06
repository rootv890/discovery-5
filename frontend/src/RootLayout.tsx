import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAuthStore } from "./store/useAuthStore";

const RootLayout = () => {
  // RUn the useEffect hook here
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const init = authStore.initialize;
  useEffect(() => {
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
