import * as Label from "@radix-ui/react-label";
import { forwardRef } from "react";
import FormError from "../FormError";
import { FieldError, FieldErrors } from "react-hook-form";
interface TextInputProps extends React.ComponentPropsWithoutRef<"input"> {
  id: string;
  label: string;
  error: string | undefined;
}
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, label, type, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 items-start  w-full ">
        <Label.Root className="font-medium text-body  w-full" htmlFor={id}>
          {label}
        </Label.Root>
        <input
          ref={ref}
          id={id}
          // Attach the ref to the input element
          className="inline-flex  w-full appearance-none items-center justify-center rounded-md bg- px-6 h-[56px] leading-none text-foreground   ring-0 selection:bg-foreground selection:text-background focus-visible:ring-2 focus:outline outline-blue-600 focus:ring-2 border-2 border-black focus:border-none text-[16px] font-sans  placeholder:font-semibold placeholder:text-sm "
          type={type ?? "text"}
          placeholder="Type here"
          {...props} // Spread additional props to input
        />

        {error && <FormError error={error} type="error" />}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
