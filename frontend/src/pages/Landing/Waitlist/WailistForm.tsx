import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { TbLoader2 } from "react-icons/tb";
import TextInput from "../../../components/ui/TextInput";
import { capitalize, cn, Print, wait } from "../../../utils/utils";
import FormError from "../../../components/FormError";
import { useState } from "react";
import {
  waitlistUserRolesEnum,
  WaitlistUserRoleType,
} from "../../../drizzle/schema";
import { useWaitlistStore } from "../../../store/useWaitlistStore";

type WaitlistForm = {
  email: string;
  name: string;
  role: WaitlistUserRoleType;
  newsletter: boolean;
};

const WaitlistForm = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const navigate = useNavigate();
  const createWaitlist = useWaitlistStore((state) => state.createWaitlist);

  // Form Props
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WaitlistForm>({
    defaultValues: {
      email: "",
      name: "",
      role: "designer",
      newsletter: false,
    },
  });

  const onSubmit: SubmitHandler<WaitlistForm> = (data: WaitlistForm) => {
    setStatus("loading");
    wait(2000).then(async () => {
      try {
        const dataStatus = await createWaitlist(data);
        // @ts-nocheck it will reutrn a boolean
        if (dataStatus) {
          setStatus("success");
          navigate("/thank-you");
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        Print("Error", error);
        setStatus("error");
        throw new Error("Something went wrong");
      }
    });
  };

  return (
    <div
      className="w-fit bg-fainted animate-fade-up px-8 py-12 rounded-2xl z-10
      shadow-card-lg
    "
    >
      <div className="flex gap-1 flex-col ">
        <h1 className="text-h4 font-sans font-bold tracking-wider text-foreground flex items-center gap-1 ">
          Join Discovery5{" "}
          <span className=" font-medium leading-tight bg-foreground text-background p-1 rounded-full text-xs px-2 select-none">
            waitlist
          </span>
        </h1>
        <p className="text-body  text-balance  leading-tight text-muted">
          Join the waitlist and get updates on development
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4 "
      >
        <div className="flex flex-col gap-1">
          <TextInput
            id="name"
            type="text"
            label="Full Name"
            {...register("name", {
              required: {
                value: true,
                message: "Name is required",
              },
            })}
          />
          {errors.name && (
            <FormError
              error={errors.name.message ?? "Name is required"}
              type="error"
            />
          )}
        </div>
        <div className="">
          <TextInput
            type="email"
            id="email"
            label="Email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
          />
          {errors.email && (
            <FormError
              error={errors.email.message ?? "Email is required"}
              type="error"
            />
          )}
        </div>

        <div className="flex flex-col gap-3 justify-start">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-background px-2.5 text-[15px] leading-none text-foreground   ring-0 selection:bg-foreground selection:text-background focus-visible:ring-2 focus:outline outline-blue-600 focus:outline-2 select-none"
            {...register("role", { required: true })}
          >
            {waitlistUserRolesEnum.enumValues.map((role, index) => (
              <option key={index} value={role}>
                {capitalize(role)}
              </option>
            ))}
          </select>
          {errors.role && <p>Role is required</p>}
        </div>

        {/* Yes (or) NO  */}
        <div className="flex justify-start gap-3 items-center h-12 ">
          <input
            className=""
            type="checkbox"
            id="newsLetter"
            {...register("newsletter")}
            checked={watch("newsletter")}
            onChange={(e) => setValue("newsletter", e.target.checked)}
          />
          <label htmlFor="newsLetter">Subscribe to Newsletter</label>
          {errors.newsletter && (
            <FormError error="Newsletter is required" type="error" />
          )}
        </div>

        <button
          className={cn(
            "w-full py-4  rounded-lg text-body hover:bg-opacity-80 text-background font-semibold tracking-[0.01rem]   disabled:bg-muted disabled:text-muted transition-all duration-200  ease-in-out bg-blue-600 hover:bg-blue-700",

            status === "loading" && "bg-blue-700",
            status === "idle" && "bg-blue-600",
            status === "error" && "bg-orange-600"
          )}
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <div className="w-full mx-auto flex items-center text-background justify-center">
              <TbLoader2 className="animate-spin duration-500 animate-ease-in-out animate-infinite " />
            </div>
          ) : status === "success" ? (
            "Success"
          ) : status === "error" ? (
            <div className="w-full mx-auto flex items-center text-background gap-2  justify-center  ">
              Retry
            </div>
          ) : (
            "Join Waitlist"
          )}
        </button>
      </form>

      {status === "error" && (
        <FormError error="An error occured, please try again" type="error" />
      )}
    </div>
  );
};

export default WaitlistForm;
