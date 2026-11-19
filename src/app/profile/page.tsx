"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";

const maxPhotoSize = 5 * 1024 * 1024;
const supportedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedPhoto(null);
    setPhotoPreview(null);

    if (!file) return;
    if (!supportedPhotoTypes.includes(file.type)) {
      event.currentTarget.value = "";
      setErrorMessage("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxPhotoSize) {
      event.currentTarget.value = "";
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

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: new FormData(event.currentTarget),
      });
      const result: unknown = await response.json();
      const responseError =
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        typeof result.error === "string"
          ? result.error
          : undefined;

      if (!response.ok) {
        setErrorMessage(
          responseError ?? "Unable to update your profile. Please try again.",
        );
        return;
      }

      await refetch();
      setSelectedPhoto(null);
      setPhotoPreview(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
      setSuccessMessage("Your profile has been updated.");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function cancelProfileEdit() {
    setIsEditing(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setErrorMessage("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  if (isPending || !session) {
    return (
      <main className="grid min-h-[calc(100svh-5rem)] flex-1 place-items-center bg-[#f5faf5] px-6 py-16 dark:bg-slate-950">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading your profile...
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100svh-5rem)] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7f0] via-[#f8fbf8] to-[#e7f4eb] px-4 py-12 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-10 size-72 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-800/25"
      />
      <section
        aria-labelledby="profile-heading"
        className="relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 p-6 shadow-[0_28px_90px_-32px_rgba(6,45,36,0.3)] backdrop-blur dark:border-slate-700 dark:bg-slate-900 sm:p-9"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-700"
        />
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          &larr; Back to home
        </Link>
        <div className="mt-7 flex items-center justify-between border-b border-dashed border-slate-200 pb-4 dark:border-slate-700">
          <div>
            <h1
              id="profile-heading"
              className="text-xl font-bold tracking-tight text-slate-950 dark:text-white"
            >
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Keep your account details up to date.
            </p>
          </div>
          {isEditing ? (
            <button
              type="button"
              onClick={cancelProfileEdit}
              disabled={isSaving}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
                setIsEditing(true);
              }}
              aria-label="Edit profile"
              title="Edit profile"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300 dark:hover:border-emerald-800 dark:hover:bg-slate-700"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                <path d="m15.5 5.5 3 3M9 15l-.75 3.75L12 18l8.5-8.5a2.12 2.12 0 0 0-3-3L9 15Z" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-emerald-400 via-lime-400 to-emerald-700 p-1 shadow-lg shadow-emerald-900/20">
            <Image
              src={photoPreview ?? session.user.image ?? "/user.jpg"}
              alt={`${session.user.name || "User"} profile`}
              width={104}
              height={104}
              unoptimized
              className="size-24 rounded-full border-4 border-white object-cover dark:border-slate-800"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-slate-900 dark:text-white">
              {session.user.name || "Community member"}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {session.user.email}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form className="mt-7 space-y-5" onSubmit={handleSaveProfile}>
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Full name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                defaultValue={session.user.name}
                autoComplete="name"
                minLength={2}
                maxLength={80}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Email address
              </span>
              <p className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                {session.user.email}
              </p>
            </div>

            <div>
              <label
                htmlFor="profile-photo"
                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Profile photo
              </label>
              <input
                ref={photoInputRef}
                id="profile-photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-[#fbfdfb] text-sm text-slate-600 file:mr-4 file:border-0 file:bg-emerald-50 file:px-4 file:py-3 file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-emerald-950 dark:file:text-emerald-300 dark:hover:file:bg-emerald-900"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG, or WebP. Maximum file size: 5 MB.
                {selectedPhoto ? ` Selected: ${selectedPhoto.name}` : ""}
              </p>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving profile..." : "Save changes"}
            </button>
          </form>
        ) : (
          <dl className="mt-7 grid gap-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-800/60 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">
                Full name
              </dt>
              <dd className="mt-1.5 break-words text-sm font-semibold text-slate-900 dark:text-white">
                {session.user.name || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">
                Email address
              </dt>
              <dd className="mt-1.5 break-words text-sm font-semibold text-slate-900 dark:text-white">
                {session.user.email}
              </dd>
            </div>
          </dl>
        )}
        {successMessage && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
          >
            {successMessage}
          </p>
        )}
      </section>
    </main>
  );
}
