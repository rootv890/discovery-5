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
        backgroundColor: type === "warning" ? "#a2a80370" : "#f2421b70",
        border: type === "warning" ? "1px solid #a2a803" : "1px solid #ff421b",
      }}
      className="rounded-md  px-2 p-1 mt-2 "
    >
      <p
        style={{
          color: type === "warning" ? "#a2a803" : "#591101",
        }}
        className="text-sm text-[#591101] flex items-center justify-start gap-1"
      >
        <CgDanger className="text-xl " /> {error}
      </p>
    </div>
  );
};

export default FormError;
