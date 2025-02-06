import { Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const AuthLayout = () => {
  const authStore = useAuthStore();
  const logout = authStore.logout;
  const isLoggedIn = authStore.isLoggedIn;
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-h1 font-serif font-bold ">Discovery 5</h1>
      <Outlet />

      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default AuthLayout;
