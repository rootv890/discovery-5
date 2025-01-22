import { useNavigate } from "react-router";

const ThankYouPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="display-2">Thank you</h1>
      <p>
        We have received your request and will get back to you as soon as
        possible.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-200 hover:bg-blue-300  p-4 rounded-lg"
      >
        go back
      </button>
    </div>
  );
};

export default ThankYouPage;
