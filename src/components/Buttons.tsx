import React from "react";

export const PrimaryButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      className="bg-blue-600 text-background hover:bg-[#0081e3] text-secondary  transition-all duration-300   px-8 py-4 rounded-3xl font-serif text-3xl "
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
