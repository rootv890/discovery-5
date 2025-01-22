import { heroIllustrations, svgIllustrations } from "../data/data";
import WaitlistForm from "./WailistForm";

type WaitlistForm = {
  email: string;
  name: string;
  role: "developer" | "designer" | "both";
  newsletter: boolean;
};

const WaitlistPage = () => {
  return (
    <div className="w-full my-auto p-6 h-full    mx-auto flex flex-col items-center justify-center  relative ">
      <div className="w-full  h-fit  max-w-[406px] absolute hidden   md:flex md: lg:right-[10%] top-[-2%] pointer-events-none float animate-fade animate-once animate-ease-in delay-500  ">
        <img
          className="h-full w-full "
          src={`/illustrations/${svgIllustrations.waitlistIllustrations.webUI.url}`}
          alt=""
        />
      </div>
      <div className="w-full  h-fit  max-w-[506px] absolute hidden   lg:flex md: lg:left-[10%] bottom-[-10%] pointer-events-none float animate-fade animate-once animate-ease-in delay-500  ">
        <img
          className="h-full w-full "
          src={`/illustrations/${svgIllustrations.waitlistIllustrations.request.url}`}
          alt=""
        />
      </div>
      <WaitlistForm />
    </div>
  );
};

export default WaitlistPage;
