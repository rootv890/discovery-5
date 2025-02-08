import { Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const AuthLayout = () => {
  const authStore = useAuthStore();
  const logout = authStore.logout;
  const isLoggedIn = authStore.isLoggedIn;
  return (
    <div className="w-full h-screen   flex items-center justify-center flex-col relative">
      {/* <h1 className="text-h1 font-serif font-bold ">Discovery 5</h1> */}
      <Outlet />
      <div className="mt-4">
        <p className="font-light">
          Powered by <span className="font-medium">YouRise Studio®</span>
        </p>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]  bg-[size:36px_24px] [&>div]:absolute [&>div]:left-0 [&>div]:-top-[10%] [&>div]:-z-10 [&>div]:m-auto [&>div]:h-[310px] [&>div]:w-[310px] [&>div]:rounded-full [&>div]:bg-blue-500 [&>div]:opacity-35 [&>div]:blur-[100px]">
          <div></div>
        </div>
      </div>
      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default AuthLayout;
