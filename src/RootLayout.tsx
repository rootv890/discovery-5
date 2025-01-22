import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="">
      {/* <h1>Root Layout</h1> */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
