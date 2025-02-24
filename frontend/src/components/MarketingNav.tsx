import { Link } from "react-router";
import { PrimaryButton } from "./Buttons";
import { useWaitlistStore } from "../store/useWaitlistStore";

const MarketingNav = () => {
  const waitlistMaintaineceStatus = useWaitlistStore(
    (s) => s.isWaitlistMaintenanceActive
  );
  return (
    <div className="w-full md:h-[6rem] md:px-16 md:py-6  pt-4 pb-0 px-6  flex justify-between items-center bg-transparent">
      <Logo />
      <div className="hidden md:flex w-full  justify-end gap-8">
        <PrimaryButton
          disabled={waitlistMaintaineceStatus}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-background rounded-3xl hover:text-fainted"
        >
          <Link to={"/waitlist"}>Join Waitlist</Link>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default MarketingNav;

function Logo() {
  return (
    <div>
      <Link to={"/"}>
        <img src="/logo.svg" alt="logo" />
      </Link>
    </div>
  );
}
