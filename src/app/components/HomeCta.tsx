import Link from "next/link";

export default function HomeCta() {
  return (
    <section className="bg-[#f4f8f4] px-6 pt-12 transition-colors dark:bg-[#071a15] sm:px-8 lg:px-8">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 px-6 py-9 shadow-xl shadow-black/10 sm:px-10 sm:py-11">
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
    </section>
  );
}
