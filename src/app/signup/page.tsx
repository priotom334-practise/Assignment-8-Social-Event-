"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";

const maxPhotoSize = 5 * 1024 * 1024;
const supportedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

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

export default function SignupPage() {
  const router = useRouter();
  const { refetch: refreshSession } = authClient.useSession();
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [pendingAction, setPendingAction] = useState<"email" | "google" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    {
      label: "One special character",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ];
  const passwordIsInvalid =
    (password.length > 0 || passwordTouched) &&
    passwordRequirements.some((requirement) => !requirement.met);

  function selectPhoto(file: File | null) {
    setErrorMessage("");
    setSelectedPhoto(null);
    setPhotoPreview(null);

    if (!file) return;
    if (!supportedPhotoTypes.includes(file.type)) {
      setErrorMessage("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxPhotoSize) {
      setErrorMessage("Profile photos must be 5 MB or smaller.");
      return;
    }

    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Unable to preview this image. Please choose another.");
    };
    reader.readAsDataURL(file);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    selectPhoto(event.currentTarget.files?.[0] ?? null);
  }

  function handlePhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPhotoDragging(false);
    selectPhoto(event.dataTransfer.files[0] ?? null);
  }

  function clearPhoto() {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setErrorMessage("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setPendingAction("email");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    try {
      const { error } = await authClient.signUp.email({
        name,
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message ?? "Unable to create your account. Please try again.",
        );
        return;
      }

      if (selectedPhoto) {
        const profileData = new FormData();
        profileData.set("name", name);
        profileData.set("photo", selectedPhoto);

        try {
          const response = await fetch("/api/profile", {
            method: "PATCH",
            body: profileData,
          });
          if (!response.ok) {
            setAccountCreated(true);
            setErrorMessage(
              "Your account was created, but the photo could not be uploaded. You can add it from your profile.",
            );
            return;
          }
        } catch {
          setAccountCreated(true);
          setErrorMessage(
            "Your account was created, but the photo could not be uploaded. You can add it from your profile.",
          );
          return;
        }
      }

      await refreshSession();
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
          <div className="mb-1.5 flex items-center justify-between">
            <label
              className="text-sm font-semibold text-slate-800 dark:text-slate-200"
              htmlFor="signup-photo"
            >
              Profile photo
            </label>
            <span className="text-xs font-medium text-slate-400">Optional</span>
          </div>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsPhotoDragging(true);
            }}
            onDragLeave={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsPhotoDragging(false);
              }
            }}
            onDrop={handlePhotoDrop}
            className={`rounded-2xl border border-dashed transition-colors ${
              isPhotoDragging
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
                : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-700"
            }`}
          >
            <input
              ref={photoInputRef}
              id="signup-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              aria-describedby="signup-photo-hint"
              className="sr-only"
            />
            {selectedPhoto ? (
              <div className="flex items-center gap-3 p-3">
                <div className="shrink-0 rounded-full bg-gradient-to-br from-emerald-400 via-lime-400 to-emerald-700 p-0.5">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Selected profile photo preview"
                      width={48}
                      height={48}
                      unoptimized
                      className="size-12 rounded-full border-2 border-white object-cover dark:border-slate-800"
                    />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full bg-white text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
                      <SignupFieldIcon name="photo" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {selectedPhoto.name}
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                    Ready to upload ·{" "}
                    {(selectedPhoto.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-slate-700"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Remove selected profile photo"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="size-4"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            ) : (
              <label
                htmlFor="signup-photo"
                className="flex cursor-pointer items-center gap-3 p-3.5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
                    <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Choose a profile photo
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Browse or drop JPG, PNG, or WebP
                  </span>
                </span>
                <span className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800">
                  Browse
                </span>
              </label>
            )}
          </div>
          <p
            id="signup-photo-hint"
            className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            Maximum file size: 5 MB.
          </p>
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
                title="Password does not meet the requirements listed below."
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
            <ul
              id="signup-password-requirements"
              className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5"
            >
              {passwordRequirements.map((requirement) => (
                <li
                  key={requirement.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    requirement.met
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5 shrink-0"
                  >
                    {requirement.met ? (
                      <path d="m3.5 8 3 3 6-6" />
                    ) : (
                      <circle cx="8" cy="8" r="5.25" />
                    )}
                  </svg>
                  <span>{requirement.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {accountCreated ? (
            <Link
              href="/profile"
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Continue to your profile
            </Link>
          ) : (
            <button
              type="submit"
              disabled={pendingAction !== null}
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              {pendingAction === "email" ? "Creating account..." : "Register"}
            </button>
          )}
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
