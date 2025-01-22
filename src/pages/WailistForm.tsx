import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateWaitlist } from "../store/useCreateWaitlist";
import FormError from "../components/FormError";
import TextInput from "../components/ui/TextInput";
import { wait } from "../utiils/utils";
import { useNavigate } from "react-router";

const WaitlistForm = () => {
  const navigate = useNavigate();
  const createWaitlist = useCreateWaitlist((state) => state.createWaitlist);
  const status = useCreateWaitlist((state) => state.status);
  const setStatus = useCreateWaitlist((state) => state.setStatus)!;
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
        await createWaitlist(data);
        setStatus("success");
      } catch (error) {
        console.log("Error creating waitlist", error);
        setStatus("error");
      }
    });

    // redirect to success page
    wait(1000).then(() => {
      navigate("/thank-you");
    });
  };

  return (
    <div
      className="w-fit bg-fainted animate-fade-up px-8 py-12 rounded-2xl z-10
      shadow-card-lg
    "
    >
      {status}
      <div className="flex gap-1 flex-col ">
        <h1 className="text-h4 font-sans font-bold tracking-wider text-foreground">
          Join Discovery5
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
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="both">Both</option>
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
          className="bg-foreground w-full py-4 text-background rounded-lg font-medium text-body hover:bg-opacity-80 hover:text-white  disabled:bg-muted disabled:text-muted transition-colors delay-500 ease-in-out"
          style={{
            backgroundColor:
              status === "success"
                ? "var(--green-500)"
                : status === "error"
                ? "var(--red-500)"
                : "var(--foreground)",
          }}
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading"
            ? "Loading"
            : status === "success"
            ? "Success"
            : status === "error"
            ? "Error"
            : "Join Waitlist"}
        </button>
      </form>
    </div>
  );
};

export default WaitlistForm;
