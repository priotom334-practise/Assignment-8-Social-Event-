import Image from "next/image";
import Link from "next/link";
import AuthNavActions from "./AuthNavActions";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm shadow-emerald-950/5 transition-colors dark:border-white/10 dark:bg-[#062d24] dark:shadow-emerald-950/10">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="CommunityCare home"
          className="flex items-center justify-self-start self-center"
        >
          <Image
            src="/logo.png"
            alt="CommunityCare"
            width={2137}
            height={736}
            preload
            className="h-8 w-auto object-contain sm:h-12 dark:brightness-0 dark:invert"
          />
        </Link>

        <Link
          href="/upcoming-events"
          className="justify-self-center self-center whitespace-nowrap rounded-full px-1 py-2 text-[10px] font-semibold tracking-wide text-slate-700 transition-colors hover:text-emerald-700 dark:text-white dark:hover:text-lime-300 sm:px-4 sm:text-sm"
        >
          Upcoming events
        </Link>

        <div className="flex h-full items-center justify-self-end gap-1.5 sm:gap-3">
          <ThemeToggle />
          <AuthNavActions />
        </div>
      </nav>
    </header>
  );
}