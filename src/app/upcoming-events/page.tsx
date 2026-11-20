import type { Metadata } from "next";
import Link from "next/link";
import UpcomingEventsList from "@/app/components/UpcomingEventsList";

export const metadata: Metadata = {
  title: "Upcoming Events | CommunityCare",
  description:
    "Explore community events and find a meaningful way to get involved.",
};

export default function UpcomingEventsPage() {
  return (
    <main>
      <section className="border-b border-emerald-100 bg-[#f1f8f2] transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Find your next way to give back
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Upcoming Events
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                Meet your neighbors, share what you can, and help make your
                community a kinder place.
              </p>
            </div>
            <Link
              href="/create-event"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Create an event
            </Link>
          </div>
        </div>
      </section>
      <UpcomingEventsList />
    </main>
  );
}
