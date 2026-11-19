"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthNavActions() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          <span className="hidden max-w-28 truncate text-xs font-semibold text-slate-700 dark:text-white/85 sm:inline">
            {session.user.name}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="whitespace-nowrap rounded-full px-2 py-2 text-[10px] font-semibold text-slate-700 transition-colors hover:text-emerald-700 disabled:opacity-60 dark:text-white/85 dark:hover:text-white sm:px-3 sm:text-sm"
          >
            {isSigningOut ? "Logging out..." : "Log out"}
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
