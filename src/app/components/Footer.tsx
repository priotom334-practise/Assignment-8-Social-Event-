import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f4f8f4] text-slate-900 transition-colors dark:bg-[#071a15] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
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