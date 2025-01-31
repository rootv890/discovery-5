import { heroIllustrations } from "../../data/data";
import { randomRotate } from "../../utils/utils";
import { Link } from "react-router";
//TODO Replace with custom built Radix Button component later
import { GhostButton, PrimaryButton } from "../../components/Buttons";
import { useWaitlistStore } from "../../store/useWaitlistStore";

const LandingPage = () => {
  const waitlistMaintaineceStatus = useWaitlistStore(
    (state) => state.isWaitlistMaintenanceActive
  );

  return (
    <section className="w-full h-full p-6 bg-background flex flex-col items-center  pb-8  ">
      <div className="h-full my-auto flex flex-col justify-center items-center">
        <div
          className="  flex flex-col items-center justify-center md:mt-8
     "
        >
          {
            // Show waitlist maintenance message
            waitlistMaintaineceStatus && (
              <div className="bg-orange-100 text-orange-700  px-3 mb-4 shadow-lg  py-2 rounded-full flex items-center gap-2 justify-center">
                <div className="bg-orange-400 rounded-full size-3"></div>{" "}
                Currently under maintainence
              </div>
            )
          }

          <h1 className="display ">Discover To</h1>
          {/* images */}

          <div className="grid  grid-cols-2 md:grid-cols-4 items-center gap-1  md:-my-4 max-sm:px-12 max-lg:px-8">
            {heroIllustrations.map((illustration, index) => (
              <div
                style={{
                  transform: `rotate(${randomRotate(index, 5)}deg)`,
                }}
                key={`${illustration.identifier + index}`}
                className="max-w-[calc(20vmax)] lg:max-w-[248px] h-auto shadow-2xl -mx-2  max-md:-my-2"
              >
                <img
                  src={`/images/${illustration.url}`}
                  alt={illustration.identifier}
                  className="size-full rounded-2xl"
                />
              </div>
            ))}
          </div>

          <h1 className="display-2">Create, Learn & Grow</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 md:gap-5">
          <div className="w-[1.8px] h-8 bg-black"></div>
          <p className="body text-balance ">
            An always-free, carefully curated resource hub created with care for
            designers and developers. No AI involvement — everything is
            handcrafted by humans.
          </p>
          <Link to={"/waitlist"}>
            {" "}
            <PrimaryButton disabled={waitlistMaintaineceStatus}>
              Join the Waitlist
            </PrimaryButton>
          </Link>
          <p>
            Wanna contribute?{" "}
            <GhostButton
              onClick={() => {
                alert("This feature is not available yet");
              }}
            >
              Click here
            </GhostButton>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
