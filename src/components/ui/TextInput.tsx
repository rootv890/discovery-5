import * as Label from "@radix-ui/react-label";
import { forwardRef } from "react";
interface TextInputProps extends React.ComponentPropsWithoutRef<"input"> {
  id: string;
  label: string;
}
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, label, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 items-start  w-full ">
        <Label.Root className="font-medium text-body  w-full" htmlFor={id}>
          {label}
        </Label.Root>
        <input
          ref={ref}
          id={id}
          // Attach the ref to the input element
          className="inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-background px-2.5 text-[15px] leading-none text-foreground   ring-0 selection:bg-foreground selection:text-background focus-visible:ring-2 focus:outline outline-blue-600 focus:outline-2 "
          type={type ?? "text"}
          {...props} // Spread additional props to input
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
