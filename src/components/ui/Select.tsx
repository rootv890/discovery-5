import * as SelectX from "@radix-ui/react-select";

import { forwardRef } from "react";
import { FaAngleRight } from "react-icons/fa6";

interface SelectProps {
  id: string;
  label: string;
  options: string[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, options, ...props }, ref) => {
    return (
      <SelectX.Root>
        <SelectX.Trigger>
          <SelectX.Value placeholder="Choose Role..." />
          <SelectX.Icon>
            <FaAngleRight />
          </SelectX.Icon>
        </SelectX.Trigger>

        <SelectX.Portal>
          <SelectX.Content className="overflow-hidden rounded-md bg-background">
            <SelectX.Viewport className="p-[5px]">
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectX.Viewport>
          </SelectX.Content>
        </SelectX.Portal>
      </SelectX.Root>
    );
  }
);

export default Select;

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-violet11 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
