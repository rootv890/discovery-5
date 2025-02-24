import { Outlet } from "react-router";
import MarketingNav from "../../components/MarketingNav";

const LandingLayout = () => {
  return (
    <div className="w-screen h-screen relative  mx-auto bg-background flex flex-col">
      <MarketingNav />
      <div className="flex-grow w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default LandingLayout;
