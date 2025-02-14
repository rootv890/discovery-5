import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "../../../components/FormError";
import { TbLoader2 } from "react-icons/tb";
import { z } from "zod";

import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

import { useState } from "react";
import { Link } from "react-router";
import { capitalize, cn } from "../../../utils/utils";
import TextInput from "../../../components/ui/TextInput";

const genders = ["male", "female", "other", "prefer_not_to_say"] as const;
const loginSchema = z
  .object({
    // Stage 01 - ALL MAINS
    email: z.string().email(),
    username: z.string().min(3),
    password: z
      .string()
      .min(6)
      .refine((value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        if (!hasUpperCase) {
          throw "Password must contain at least one uppercase letter";
        } else if (!hasNumber) {
          throw "Password must contain at least one number";
        } else if (!hasSpecialChar) {
          throw "Password must contain at least one special character";
        }
        return true;
      }),
    // Stage 02 - ALL OPTIONALS
    bio: z.string().max(512).optional(),
    avatar: z.string().url().optional(),
    gender: z.enum(genders).optional(),
  })
  .refine((data) => !!data.email || !!data.username, {
    message: "Email or Username is required",
    path: ["email"],
  });

type RegisterFormInputs = z.infer<typeof loginSchema>;

const STAGES = ["basics", "optionals"] as const;

const RegisterPage = () => {
  const [currentStage, setCurrentStage] = useState<"basics" | "optionals">(
    STAGES[0]
  );
  // Form Data
  const [formData, setFormData] = useState<RegisterFormInputs>({
    email: "",
    username: "",
    password: "",
    bio: "",
    avatar: "",
    gender: "prefer_not_to_say",
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setValue, // to update the value of a field
    getValues, // to get the values of all fields
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: formData,
  });

  const authStore = useAuthStore();
  const accessTokenSetter = authStore.setAccessToken;
  const loggedInSetter = authStore.setIsLoggedIn;
  const isLoggedIn = authStore.isLoggedIn;
  const login = authStore.login;

  // "s1", "s2", "loading", "error", "success" > "idle";
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const mutation = useMutation(login, {
    onError: (error: any) => {
      console.log(error);
      setStatus("error");
    },
    onSuccess: (data: any) => {
      accessTokenSetter(data.accessToken as string);
      loggedInSetter(true);
      setStatus("success");
    },
  });

  const executeBasicRegistration = () => {
    const basicFormData = getValues(["email", "username", "password"]);
    setFormData({ ...formData, ...basicFormData }); // Update the form data
    setCurrentStage("optionals"); // Goes to the next stage
  };

  const onSubmit = (data: RegisterFormInputs) => {
    setStatus("loading");
    console.log("Clicked ");

    console.log(data);
    // mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center justify-center gap-4 ">
        {STAGES.map((stage, idx) => (
          <>
            <button
              onClick={() => setCurrentStage(stage)}
              key={stage}
              className={cn(
                "gap-2 bg-blue-100 flex items-center justify-center size-12 p-2 rounded-full font-medium hover:bg-blue-600 ",
                {
                  "bg-blue-600 text-white": currentStage === stage,
                }
              )}
            >
              {idx + 1}
            </button>
            {idx === STAGES.length - 1 ? null : (
              <div className="h-[0.6px] w-8 bg-blue-800"></div>
            )}
          </>

          // Add a line seprator except for the last stage
        ))}
      </div>
      <div className=" relative w-[500px] p-[50px] rounded-3xl  bg-white shadow-[0_0_30px_20px_#19181a0d] flex flex-col gap-3 overflow-clip">
        {/* Stages */}

        <div className="max-w-[80px]  ">
          <img
            src="/images/login.svg
        "
            className="w-full h-full rounded-2xl shadow-md"
            alt=""
          />
        </div>
        <div className="space-y-2">
          <h1
            className="text-5xl text-foreground
       font-bold mb-4"
          >
            Register
          </h1>
          <p className="text-[14px] text-slate-900 text-balance">
            Join us and unlock a hub of tools! Create your account today.
          </p>
        </div>
        <form
          className="w-full flex gap-4 flex-col "
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentStage === "basics" && (
            <>
              <div className="flex flex-col gap-2">
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Email"
                  label="Email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  onChange={(e) => {
                    clearErrors("email"); // Clear the error for the 'email' field
                  }}
                />
                {errors.email && (
                  <FormError
                    error={errors.email.message ?? "Email is required"}
                    type="error"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  id="username"
                  type="name"
                  placeholder="Username"
                  label="Username"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "username is required",
                    },
                    pattern: {
                      // no space, lowercase , no special char only _ , no continus _,
                      value: /^[a-z0-9_]+$/, // means only lowercase letters, numbers and underscores are allowed
                      message: "Invalid username format",
                    },
                  })}
                  onChange={(e) => {
                    clearErrors("username"); // Clear the error for the 'email' field
                  }}
                />
                {errors.username && (
                  <FormError
                    error={errors.username.message ?? "Email is required"}
                    type="error"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Password"
                  label="Password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "username is required",
                    },
                  })}
                  onChange={(e) => {
                    clearErrors("password"); // Clear the error for the 'email' field
                  }}
                />
                {errors.password && (
                  <FormError
                    error={errors.password.message ?? "Email is required"}
                    type="error"
                  />
                )}
              </div>

              <button
                onClick={executeBasicRegistration}
                disabled={status === "loading" || mutation.isLoading}
                className="w-full py-4  rounded-lg text-body hover:bg-opacity-80 text-background font-semibold tracking-[0.01rem]   disabled:bg-blue-50 disabled:text-muted transition-all duration-200 mt-2  ease-in-out bg-blue-600 hover:bg-blue-700"
                type="button"
              >
                Next
              </button>
            </>
          )}

          {currentStage === "optionals" && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="avatar">Upload Avatar</label>
                <input hidden aria-hidden type="file" id="avatar" />

                {/* A custom preview and upload button */}
                <button
                  // onClick to open the file dialog
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "avatar"
                    ) as HTMLInputElement;
                    console.log(fileInput, "fileInput");

                    fileInput.click();
                  }}
                  type="button"
                  className="inline-flex h-[64px]  appearance-none items-center justify-center  bg-transparent  text-blue-800 w-full
                   border-dashed border-2 border-blue-950/90   p-5  text-[15px] leading-none rounded-md  ring-0 selection:bg-foreground selection:text-background focus-visible:ring-2 focus:outline outline-blue-600 focus:outline-2 select-none"
                >
                  Double click or drag and drop to upload
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-3 justify-start">
                  <label htmlFor="role">Select Gender</label>
                  <select
                    id="role"
                    className=" w-full appearance-none items-center rounded-md  bg-transparent px-5 py-4      border border-blue-900 flex   leading-none text-foreground   ring-0 selection:bg-foreground selection:text-background focus-visible:ring-2 focus:outline outline-blue-600 focus:outline-2 select-none"
                    {...register("gender", { required: true })}
                  >
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {capitalize(g).split("_").join(" ")}
                      </option>
                    ))}
                  </select>
                  {errors.gender?.message && <p>Role is required</p>}
                </div>
              </div>

              <button
                disabled={status === "loading" || mutation.isLoading}
                className="w-full py-4  rounded-lg text-body hover:bg-opacity-80 text-background font-semibold tracking-[0.01rem]   disabled:bg-blue-50 disabled:text-muted transition-all duration-200 mt-2  ease-in-out bg-blue-600 hover:bg-blue-700"
                type="submit"
              >
                {status === "loading" && (
                  <div className="flex items-center justify-center gap-2">
                    <TbLoader2 className="animate-spin" /> Loading
                  </div>
                )}
                {currentStage === "optionals" &&
                  status === "idle" &&
                  "Register"}
              </button>
            </>
          )}
        </form>

        <div className="flex w-full justify-start">
          <p className="text-muted ">
            Already have an account ?{" "}
            <Link
              className="text-foreground font-medium hover:underline underline-offset-2"
              to={"/auth/login"}
            >
              Login
            </Link>
          </p>
        </div>

        {/* {isLoggedIn ? "Success" : "Na"} */}

        {/* blur */}
        <div className="bg-gradient-to-r from-[#199bfe] to-[#199bfe] size-24 absolute -right-[5%] -top-[5%] blur-[50px]"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
