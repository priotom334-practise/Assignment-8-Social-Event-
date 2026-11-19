"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthNavActions() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleSignOut() {
    setErrorMessage("");
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setErrorMessage(error.message ?? "Unable to log out.");
        return;
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to log out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="relative flex items-center gap-1.5 sm:gap-3">
      {session ? (
        <>
          <div
            className="group relative"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
            onFocusCapture={() => setIsMenuOpen(true)}
            onBlurCapture={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsMenuOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.querySelector("button")?.focus();
                setIsMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={isMenuOpen}
              aria-controls="account-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-full bg-gradient-to-br from-emerald-400 via-lime-400 to-emerald-700 p-0.5 shadow-md shadow-emerald-900/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Image
                src={session.user.image || "/user.jpg"}
                alt={`${session.user.name || "User"} profile`}
                width={40}
                height={40}
                unoptimized
                className="size-9 rounded-full border-2 border-white object-cover sm:size-10"
              />
            </button>
            <nav
              id="account-menu"
              aria-label="Account links"
              className={`absolute right-0 top-full z-50 w-64 pt-2 transition duration-150 ${
                isMenuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/15 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-lime-50 px-4 py-4 dark:from-slate-800 dark:to-emerald-950">
                  <Image
                    src={session.user.image || "/user.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="size-10 rounded-full border border-white object-cover shadow-sm dark:border-slate-600"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {session.user.name || "Community member"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20a7 7 0 0 1 14 0" />
                      </svg>
                    </span>
                    Edit Profile
                  </Link>
                  <Link
                    href="/create-event"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18M12 13v5m-2.5-2.5h5" />
                      </svg>
                    </span>
                    Create Event
                  </Link>
                  <Link
                    href="/manage-events"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4Z" />
                        <path d="m13.5 6.5 4 4" />
                      </svg>
                    </span>
                    Manage Events
                  </Link>
                  <Link
                    href="/joined-events"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <circle cx="9" cy="8" r="3" />
                        <path d="M3 20a6 6 0 0 1 12 0m3-12a3 3 0 0 1 0 6m1 2a5 5 0 0 1 2 4" />
                      </svg>
                    </span>
                    Joined Events
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="whitespace-nowrap rounded-full px-2 py-2 text-[10px] font-semibold text-slate-700 transition-colors hover:text-emerald-700 disabled:opacity-60 dark:text-white/85 dark:hover:text-white sm:px-3 sm:text-sm"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-700 dark:text-white/85 dark:hover:text-white sm:inline-flex sm:px-3 sm:text-sm"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-full bg-emerald-500 px-2 py-2 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-400 sm:px-5 sm:text-sm"
          >
            Sign up
          </Link>
        </>
      )}
      {errorMessage && (
        <p
          role="alert"
          className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 shadow-lg dark:bg-red-950 dark:text-red-200"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
