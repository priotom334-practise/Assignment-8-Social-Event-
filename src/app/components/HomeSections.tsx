import Link from "next/link";
import { eventTypes, type EventType } from "@/lib/event-types";

const steps = [
  {
    number: "01",
    title: "Find an event",
    description:
      "Explore local activities and choose a cause or gathering that feels right for you.",
  },
  {
    number: "02",
    title: "Meet your neighbors",
    description:
      "Show up, lend a hand, and get to know the people working alongside you.",
  },
  {
    number: "03",
    title: "Make it happen",
    description:
      "Have an idea of your own? Create an event and bring your community together.",
  },
];

const eventTypeDescriptions: Record<EventType, string> = {
  Cleanup: "Pitch in to make parks, streets, and shared spaces shine.",
  Plantation: "Help grow greener neighborhoods, one plant at a time.",
  Donation: "Share useful items and support with neighbors who need them.",
  "Food Drive": "Help bring food and care to people in your community.",
  "Community Gathering": "Make new connections at a welcoming local get-together.",
  Other: "Discover another meaningful way to support your community.",
};

export default function HomeSections() {
  return (
    <>
      <section
        aria-labelledby="how-it-works-heading"
        className="bg-[#f4f8f4] px-6 py-16 transition-colors dark:bg-[#071a15] sm:px-8 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 sm:text-sm">
              Your next step starts here
            </p>
            <h2
              id="how-it-works-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl"
            >
              Community starts with showing up
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Finding a way to help is simple. Choose an event, connect with
              neighbors, and make a difference together.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Explore events <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-700 dark:text-emerald-300 dark:hover:bg-slate-900"
            >
              Host an event
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="event-types-heading"
        className="bg-white px-6 py-16 transition-colors dark:bg-slate-950 sm:px-8 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 sm:text-sm">
                Many ways to make a difference
              </p>
              <h2
                id="event-types-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl"
              >
                Find the kind of event that feels right
              </h2>
            </div>
            <Link
              href="/upcoming-events"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              View upcoming events <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((eventType, index) => (
              <article
                key={eventType}
                className="group rounded-2xl border border-slate-200 bg-[#fbfdfb] p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800 transition-colors group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300 dark:group-hover:bg-emerald-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {eventType}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {eventTypeDescriptions[eventType]}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
