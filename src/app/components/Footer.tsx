import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f4f8f4] text-slate-900 transition-colors dark:bg-[#071a15] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pt-12 sm:px-8 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 px-6 py-9 shadow-xl shadow-black/10 sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-28 size-80 rounded-full border-[48px] border-white/[0.06]"
          />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                Your next chapter starts here
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Let’s make good things happen.
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-50/80 sm:text-base">
                Find an event, meet your neighbors, and be part of a community
                that cares.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-center"
            >
              Join CommunityCare
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="CommunityCare home"
              className="inline-flex rounded-xl bg-white px-3 py-1.5 transition hover:bg-emerald-50"
            >
              <Image
                src="/logo.png"
                alt="CommunityCare"
                width={2137}
                height={736}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-emerald-100/75">
              Bringing neighbors together through meaningful events and care
              for our community.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-emerald-950 dark:text-white">
              Explore
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-emerald-100/75">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-white"
                >
                  Get involved
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-emerald-950 dark:text-white">
              Your account
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-emerald-100/75">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-white"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-200/70 dark:border-white/10">
          <p className="mx-auto max-w-7xl py-5 text-xs text-slate-500 dark:text-emerald-100/55">
            © CommunityCare. Made for stronger communities.
          </p>
        </div>
      </div>
    </footer>
  );
}