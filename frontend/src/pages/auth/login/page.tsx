import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "../../../components/FormError";
import { TbLoader2 } from "react-icons/tb";
import { z } from "zod";

import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import TextInput from "../../../components/ui/TextInput";
import { useEffect, useState } from "react";

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
    onSuccess: (data: any) => {
      // console.log(data);
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
    <div className="w-fit p-6 rounded-md  bg-fainted ">
      <h1 className="text-3xl mb-4">Login</h1>
      <form
        className="w-fit flex gap-3 flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          id="email"
          type="email"
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

        {errors.password && <span>{errors.password.message}</span>}
        <button
          disabled={status === "loading" || mutation.isLoading}
          className="w-full py-4  rounded-lg text-body hover:bg-opacity-80 text-background font-semibold tracking-[0.01rem]   disabled:bg-muted disabled:text-muted transition-all duration-200  ease-in-out bg-blue-600 hover:bg-blue-700"
          type="submit"
        >
          {status === "loading" ? (
            <TbLoader2 className="animate-spin" />
          ) : (
            "Login"
          )}
        </button>
      </form>
      {isLoggedIn ? "Success" : "Na"}
    </div>
  );
};

export default LoginPage;
