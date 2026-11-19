"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

function SignupFieldIcon({
  name,
}: {
  name: "user" | "email" | "photo" | "lock";
}) {
  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    photo: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      {paths[name]}
    </svg>
  );
}

function meetsPasswordRequirements(password: string) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password) &&
    !/\s/.test(password)
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [pendingAction, setPendingAction] = useState<"email" | "google" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const passwordIsInvalid =
    (password.length > 0 || passwordTouched) &&
    !meetsPasswordRequirements(password);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setPendingAction("email");

    const formData = new FormData(event.currentTarget);
    const image = String(formData.get("photo") ?? "").trim();

    try {
      const { error } = await authClient.signUp.email({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        ...(image ? { image } : {}),
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message ?? "Unable to create your account. Please try again.",
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleGoogleSignup() {
    setErrorMessage("");
    setPendingAction("google");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message ?? "Unable to continue with Google. Please try again.",
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to continue with Google. Please try again.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7f0] via-[#f8fbf8] to-[#e7f4eb] px-4 py-12 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-16 h-80 w-[120%] -rotate-6 rounded-[50%] bg-emerald-200/65 dark:bg-emerald-900/45"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 -right-24 h-80 w-[110%] rotate-6 rounded-[50%] bg-lime-100/80 dark:bg-emerald-800/35"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-12 size-80 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-700/20"
      />

      <section
        aria-labelledby="signup-heading"
        className="relative w-full max-w-[440px] overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 px-6 py-8 shadow-[0_28px_90px_-32px_rgba(6,45,36,0.32)] ring-1 ring-emerald-950/[0.03] backdrop-blur dark:border-slate-700 dark:bg-slate-900 dark:ring-white/5 sm:px-10 sm:py-9"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-700"
        />
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-700/20 ring-4 ring-emerald-50">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
          >
            <path d="M20.8 8.7c0 5.2-8.8 10.1-8.8 10.1S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" />
          </svg>
        </div>
        <h1
          id="signup-heading"
          className="mt-5 text-center text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
        >
          Create an Account
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
          Join your neighbors and help your community thrive.
        </p>

        <form
          aria-labelledby="signup-heading"
          className="mt-6 space-y-3"
          onSubmit={handleSignup}
        >
          <div>
            <label className="sr-only" htmlFor="signup-name">
              Full name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <SignupFieldIcon name="user" />
              </span>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Full Name"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="sr-only" htmlFor="signup-email">
              Email address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <SignupFieldIcon name="email" />
              </span>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email Address"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="sr-only" htmlFor="signup-photo">
              Photo URL (optional)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <SignupFieldIcon name="photo" />
              </span>
              <input
                id="signup-photo"
                name="photo"
                type="url"
                autoComplete="url"
                placeholder="Photo URL (optional)"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="sr-only" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <SignupFieldIcon name="lock" />
              </span>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                required
                minLength={6}
                pattern={
                  "(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\\s])(?!.*\\s).{6,}"
                }
                title="Use at least 6 characters, including an uppercase letter, a lowercase letter, and a special character."
                aria-describedby="signup-password-requirements"
                aria-invalid={passwordIsInvalid || undefined}
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                onBlur={() => setPasswordTouched(true)}
                onInvalid={() => setPasswordTouched(true)}
                className={`h-12 w-full rounded-xl border bg-[#fbfdfb] pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:bg-slate-800 dark:focus:bg-slate-800 ${
                  passwordIsInvalid
                    ? "border-red-500 hover:border-red-500 focus:border-red-500 dark:border-red-400 dark:hover:border-red-400 dark:focus:border-red-400"
                    : "border-slate-200 hover:border-emerald-300 focus:border-emerald-500 dark:border-slate-700"
                }`}
              />
            </div>
            <p
              id="signup-password-requirements"
              className={`mt-2 text-xs leading-5 ${
                passwordIsInvalid
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              At least 6 characters, with an uppercase letter, a lowercase
              letter, and a special character.
            </p>
          </div>
          <button
            type="submit"
            disabled={pendingAction !== null}
            className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {pendingAction === "email" ? "Creating account..." : "Register"}
          </button>
        </form>

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          or
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={pendingAction !== null}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700"
        >
          <span
            aria-hidden="true"
            className="bg-gradient-to-r from-blue-600 via-green-500 to-amber-500 bg-clip-text text-base font-extrabold text-transparent"
          >
            G
          </span>
          {pendingAction === "google"
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
