"use server";

import { signIn } from "@/auth";
import { signInSchema } from "@/utils/zod/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const loginAction = async (values: z.infer<typeof signInSchema>) => {
  try {
    await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      // Tipar la causa explícitamente si se espera una estructura
      const cause = error.cause as { message?: string } | undefined;
      return { message: cause?.message ?? "Credenciales incorrectas" };
    }
    return { message: "Error 500: Fallo inesperado del servidor" };
  }
};
