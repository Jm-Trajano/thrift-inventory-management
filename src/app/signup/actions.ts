"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";

export interface SignUpActionState {
  error: string | null;
  fieldErrors: {
    confirmPassword?: string;
    email?: string;
    password?: string;
  };
  success: string | null;
}

export async function signUp(
  _previousState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const parsed = signUpSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      error: null,
      fieldErrors: {
        confirmPassword: fieldErrors.confirmPassword?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      success: null,
    };
  }

  const supabase = await createClient();
  const { email, password } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
      fieldErrors: {},
      success: null,
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    error: null,
    fieldErrors: {},
    success:
      "Account created. If email confirmation is enabled in Supabase, verify your email first, then sign in.",
  };
}
