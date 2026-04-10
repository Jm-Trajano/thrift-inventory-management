"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginActionState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

const initialState: LoginActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-none bg-ink-primary px-6 text-canvas hover:bg-ink-primary/90"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-[0.24em] text-ink-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border-b border-ink-secondary bg-transparent pb-3 text-base text-ink-primary outline-none transition-colors placeholder:text-ink-muted focus:border-ink-primary"
          placeholder="owner@shop.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-[0.24em] text-ink-muted"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border-b border-ink-secondary bg-transparent pb-3 text-base text-ink-primary outline-none transition-colors placeholder:text-ink-muted focus:border-ink-primary"
          placeholder="Enter your password"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-status-archived">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
