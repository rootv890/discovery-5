import { CgDanger } from "react-icons/cg";

const FormError = ({
  error,
  type,
}: {
  error: string;
  type: "warning" | "error";
}) => {
  return (
    <div
      style={{
        backgroundColor: type === "warning" ? "#a2a80370" : "#f2421b50",
        border:
          type === "warning" ? "1px solid #a2a803" : "1px solid #ff421b50",
      }}
      className="rounded-md px-2 p-1 w-fit ml-auto"
    >
      <p
        style={{
          color: type === "warning" ? "#a2a803" : "#591101",
        }}
        className="text-sm text-[#591101] flex items-center justify-start gap-1"
      >
        <CgDanger className="text-xl animate-wiggle-more animate-iteration-infinite " />{" "}
        {error}
      </p>
    </div>
  );
};

export default FormError;
