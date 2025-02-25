import { useNavigate } from "react-router";

const ThankYouPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full mx-auto my-auto p-6">
      <div
        className="flex flex-col items-center  bg-fainted max-w-fit  mx-auto p-8 rounded-2xl justify-center gap-6 m-6  text-center form-shadow
    animate-fade-up"
      >
        <div className="w-full max-w-[312px] mt-8">
          <img src={`/illustrations/thank-you.svg`} alt="" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="display-2">Thank you</h1>
          <p className="text-balance max-w-[40ch]">
            We have received your request and will get back to you as soon as
            possible.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-foreground text-background px-6  hover:bg-blue-900  p-4 rounded-lg w-full"
        >
          go back
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
