"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { cn } from "@/utils/cn";

export default function LoginForm() {
  const [data, action, isPending] = useActionState(loginAction, null);
  return (
    <form
      action={action}
      className="w-full max-w-96 mx-auto flex flex-col gap-y-4"
    >
      <h1 className="text-4xl font-bold">Login Form</h1>
      <p
        aria-live="polite"
        className={cn(
          "hidden",
          {
            "block bg-red-700 px-4 py-2 text-white rounded":
              data !== null && !data?.success && data?.error?.main,
          },
          {
            "block bg-green-700 px-4 py-2 text-white":
              data !== null && data?.success && data?.message?.main,
          }
        )}
      >
        {data !== null && data?.success && data?.message?.main}
        {data !== null && !data?.success && data?.error?.main}
      </p>
      <fieldset className="flex flex-col gap-y-1">
        <label htmlFor="username">
          Username <sup className="text-red-700 font-bold">*</sup>
        </label>
        <input
          defaultValue={data?.data.username as string}
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username..."
          className="focus:ring-black focus:border-black rounded"
        />
        <span className="text-red-700 font-semibold text-sm" aria-live="polite">
          {data !== null && !data?.success && data?.error?.username}
        </span>
      </fieldset>
      <fieldset className="flex flex-col gap-y-1">
        <label htmlFor="email">
          Email <sup className="text-red-700 font-bold">*</sup>
        </label>
        <input
          defaultValue={data?.data.email as string}
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email..."
          className="focus:ring-black focus:border-black rounded"
        />
        <span className="text-red-700 font-semibold text-sm" aria-live="polite">
          {data !== null && !data?.success && data?.error?.email}
        </span>
      </fieldset>
      <fieldset className="flex flex-col gap-y-1">
        <label htmlFor="password">
          Password <sup className="text-red-700 font-bold">*</sup>
        </label>
        <input
          defaultValue={data?.data.password as string}
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password..."
          className="focus:ring-black focus:border-black rounded"
        />
        <span className="text-red-700 font-semibold text-sm" aria-live="polite">
          {data !== null && !data?.success && data?.error?.password}
        </span>
      </fieldset>
      <fieldset className="flex flex-col gap-y-1">
        <label htmlFor="confirm_password">
          Confirm Password <sup className="text-red-700 font-bold">*</sup>
        </label>
        <input
          defaultValue={data?.data.confirm_password as string}
          type="password"
          name="confirm_password"
          id="confirm_password"
          placeholder="Re-enter your password..."
          className="focus:ring-black focus:border-black rounded"
        />
        <span className="text-red-700 font-semibold text-sm" aria-live="polite">
          {data !== null && !data?.success && data?.error?.confirm_password}
        </span>
      </fieldset>
      <fieldset className="flex gap-x-2">
        <button
          disabled={isPending} // the user have already focused on and performed the action so this option is fine for accessibility in this use case.
          type="submit"
          className="bg-green-700 text-white px-4 py-2 hover:bg-green-800 focus-visible:bg-green-800 focus-visible:outline-green-800 rounded w-full disabled:bg-green-800/70"
        >
          {isPending ? "Login in..." : "Login"}
        </button>
      </fieldset>
    </form>
  );
}
