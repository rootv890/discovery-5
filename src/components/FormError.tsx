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
      className="rounded-md bg-opacity-75 p-2 mt-2 "
    >
      <p
        style={{
          color: type === "warning" ? "#a2a803" : "#591101",
        }}
        className="text-sm text-[#591101]"
      >
        {error}
      </p>
    </div>
  );
};

export default FormError;
