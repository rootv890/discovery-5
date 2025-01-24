import { Link } from "react-router";
import { marketingNavItems } from "../data/data";
import { PrimaryButton } from "./Buttons";

const MarketingNav = () => {
  return (
    <div className="w-full md:h-[6rem] md:px-16 md:py-6  pt-4 pb-0 px-6  flex justify-between items-center bg-transparent">
      <Logo />
      <div className="hidden md:flex w-full  justify-end gap-8">
        {/* <ul className="flex gap-4 items-center ">
          {marketingNavItems.map((item, index) => (
            <li className="lowercase" key={index}>
              {item.title}
            </li>
          ))}
        </ul> */}

        <PrimaryButton className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-background rounded-3xl hover:text-fainted">
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
