"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "communitycare-theme";

export default function ThemeToggle() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const useDarkTheme =
      storedTheme === "dark" ||
      (storedTheme === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", useDarkTheme);
  }, []);

  function toggleTheme() {
    const useDarkTheme = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", useDarkTheme);
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      useDarkTheme ? "dark" : "light",
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-[4.5rem] shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-200 px-0.5 transition-colors hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-white/20 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus-visible:outline-white"
    >
      <span className="absolute left-0.5 top-0.5 size-8 rounded-full bg-white shadow-md transition-transform dark:translate-x-9" />
      <span className="grid size-8 place-items-center text-orange-500 dark:text-slate-400">
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      </span>
      <span className="grid size-8 place-items-center text-slate-400 dark:text-blue-600">
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
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z" />
          <path d="M16.5 3v3m-1.5-1.5h3M20 8v2m-1-1h2" />
        </svg>
      </span>
    </button>
  );
}
