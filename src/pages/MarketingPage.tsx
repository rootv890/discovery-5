import { Outlet } from "react-router";
import MarketingNav from "../components/MarketingNav";

const MarketingPage = () => {
  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto bg-background">
      <MarketingNav />
      <Outlet />
    </div>
  );
};

export default MarketingPage;
