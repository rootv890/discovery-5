import { cn } from "../utils/utils";

export const PrimaryButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      style={{
        backgroundColor: props.disabled ? "#b3b3b3" : "#0077ff",
        color: props.disabled ? "#f0f0f0" : "#f0f0f0",
        cursor: props.disabled ? "not-allowed" : "pointer",
      }}
      className={cn(
        '"bg-blue-600 text-background hover:bg-[#0081e3] text-secondary  transition-all duration-300   px-8 py-4 rounded-3xl font-serif text-3xl "',
        // disabled styles
        props.disabled &&
          "bg-blue-300 text-background cursor-not-allowed hover:bg-blue-300"
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};

export const GhostButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      className="bg-transparent hover:text-[#616161] transition-all duration-300  font-sans body underline underline-offset-4"
      {...props}
    >
      {props.children}
    </button>
  );
};
