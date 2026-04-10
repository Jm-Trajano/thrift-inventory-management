"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signUp, type SignUpActionState } from "@/app/signup/actions";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";

const initialState: SignUpActionState = {
  error: null,
  fieldErrors: {},
  success: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-none bg-ink-primary px-6 text-canvas hover:bg-ink-primary/90"
      disabled={pending}
    >
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <AuthField
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        label="Email"
        placeholder="owner@shop.com"
        error={state.fieldErrors.email}
      />

      <AuthField
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        label="Password"
        placeholder="At least 8 characters"
        error={state.fieldErrors.password}
      />

      <AuthField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        label="Confirm Password"
        placeholder="Repeat your password"
        error={state.fieldErrors.confirmPassword}
      />

      {state.error ? (
        <p aria-live="polite" className="text-sm text-status-archived">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p aria-live="polite" className="text-sm text-status-available">
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-sm leading-6 text-ink-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-ink-primary underline decoration-border-subtle underline-offset-4 transition-colors hover:text-accent-dark"
        >
          Sign in here
        </Link>
        .
      </p>
    </form>
  );
}
