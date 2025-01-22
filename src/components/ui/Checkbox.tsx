import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { IoMdCheckmark } from "react-icons/io";
const CheckboxComponent = () => (
  <form>
    <div className="flex items-center">
      <Checkbox.Root
        className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px_black]"
        defaultChecked
        id="c1"
      >
        <Checkbox.Indicator className="text-violet11">
          <IoMdCheckmark />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        className="pl-[15px] text-[15px] leading-none text-white"
        htmlFor="c1"
      >
        Accept terms and conditions.
      </label>
    </div>
  </form>
);

export default CheckboxComponent;
