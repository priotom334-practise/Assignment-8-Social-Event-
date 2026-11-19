import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | CommunityCare",
  description: "We couldn't find the page you were looking for.",
};

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f5faf5] px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-0 size-72 rounded-full bg-emerald-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-0 size-80 rounded-full bg-lime-200/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
          <span className="size-2 rounded-full bg-emerald-500" />
          Looks like you took a wrong turn
        </p>
        <p className="mt-8 text-7xl font-semibold tracking-tight text-emerald-700 sm:text-8xl">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          We can’t find that page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          The page may have moved, or the link might be out of date. Let’s get
          you back to CommunityCare.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Back to home
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
