"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const loginSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username should be 3 or more characters long!" }),
    email: z.string().email({ message: "Email is not valid" }),
    password: z
      .string()
      .min(8, { message: "Password should be minimum 8 characters long!" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password should be minimum 8 characters long!" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm Password doesn't match Password!",
        path: ["confirm_password"],
      });
    }
  });

export const loginAction = async (_: unknown, formData: FormData) => {
  const incomingFormData = Object.fromEntries(formData);
  const { success, data, error } = loginSchema.safeParse(incomingFormData);
  if (!success) {
    return {
      success: false,
      error: {
        username: error.formErrors?.fieldErrors?.username?.[0],
        email: error.formErrors?.fieldErrors?.email?.[0],
        password: error.formErrors?.fieldErrors?.password?.[0],
        confirm_password: error.formErrors?.fieldErrors?.confirm_password?.[0],
        main: "",
      },
      data: incomingFormData,
    };
  }
  try {
    const pathToFile = path.join(process.cwd(), "src", "app", "users.json");
    const fileData = await fs.readFile(pathToFile, "utf-8");
    const jsonData: Array<{
      username: string;
      email: string;
      password: string;
    }> = JSON.parse(fileData);
    const findUser = jsonData.find(
      (user) => user.email === data.email && user.username === data.username
    );
    if (!findUser) {
      return {
        success: false,
        error: { main: "Email or username doesn't exists!" },
        data: data,
      };
    }
    if (findUser.password !== data.password) {
      return {
        success: false,
        error: { main: "Wrong password!" },
        data: data,
      };
    }
    return { success: true, message: { main: "Login successful" }, data: data };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("no such file or directory")) {
        return {
          success: false,
          error: { main: "File Database doesn't exist!" },
          data: incomingFormData,
        };
      }
    }
  }
};
