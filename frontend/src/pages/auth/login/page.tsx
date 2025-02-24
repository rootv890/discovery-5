import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "../../../components/FormError";
import { TbLoader2 } from "react-icons/tb";
import { z } from "zod";

import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import TextInput from "../../../components/ui/TextInput";
import { useState } from "react";
import { Link } from "react-router";

const loginSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    password: z.string().min(6),
  })
  .refine((data) => !!data.email || !!data.username, {
    message: "Email or Username is required",
    path: ["email"],
  }); // !! will convert the value to boolean

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const authStore = useAuthStore();
  const accessTokenSetter = authStore.setAccessToken;
  const loggedInSetter = authStore.setIsLoggedIn;
  const isLoggedIn = authStore.isLoggedIn;
  const login = authStore.login;
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

  // alert for success
  // useEffect(() => {
  //   if (status === "success") {
  //     alert("Login successful");
  //   }
  // }, [status]);

  const onSubmit = (data: LoginFormInputs) => {
    setStatus("loading");
    mutation.mutate(data);
  };

  return (
    <div className=" relative w-[500px] p-[50px] rounded-3xl  bg-white shadow-[0_0_30px_20px_#19181a0d] flex flex-col gap-3 overflow-clip">
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
          Login
        </h1>
        <p className="text-[14px] text-slate-900">
          Welcome back! Please enter your details to login.
        </p>
      </div>
      <form
        className="w-full flex gap-4 flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <div className="flex flex-col gap-2">
          <TextInput
            id="password"
            type="password"
            label="Password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />
          {errors.password && (
            <FormError
              error={errors.password.message ?? "Password is required"}
              type="error"
            />
          )}
          <div className="flex w-full justify-end">
            <p className="text-muted ">
              <Link
                className="text-foreground font-medium hover:underline underline-offset-2"
                to={"/auth/forgot-password"}
              >
                Forgot Password
              </Link>
            </p>
          </div>
        </div>

        <button
          disabled={status === "loading" || mutation.isLoading}
          className="w-full py-4  rounded-lg text-body hover:bg-opacity-80 text-background font-semibold tracking-[0.01rem]   disabled:bg-blue-50 disabled:text-muted transition-all duration-200 mt-2  ease-in-out bg-blue-600 hover:bg-blue-700"
          type="submit"
        >
          {status === "loading" ? (
            <TbLoader2 className="animate-spin" />
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="flex w-full justify-start">
        <p className="text-muted ">
          No Account ?{" "}
          <Link
            className="text-foreground font-medium hover:underline underline-offset-2"
            to={"/auth/forgot-password"}
          >
            Create one
          </Link>
        </p>
      </div>

      {/* {isLoggedIn ? "Success" : "Na"} */}

      {/* blur */}
      <div className="bg-gradient-to-r from-[#199bfe] to-[#199bfe] size-24 absolute -right-[5%] -top-[5%] blur-[50px]"></div>
    </div>
  );
};

export default LoginPage;
