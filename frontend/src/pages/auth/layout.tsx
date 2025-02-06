import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-h1 font-serif font-bold ">Discovery 5</h1>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
