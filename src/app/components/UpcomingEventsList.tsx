"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { UpcomingEvent } from "@/lib/event-types";

export default function UpcomingEventsList() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadEvents() {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        const result: unknown = await response.json();
        const responseError =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : undefined;

        if (!response.ok) {
          throw new Error(responseError ?? "Unable to load upcoming events.");
        }
        if (
          typeof result !== "object" ||
          result === null ||
          !("events" in result) ||
          !Array.isArray(result.events)
        ) {
          throw new Error("The events response was not valid.");
        }

        if (isActive) setEvents(result.events as UpcomingEvent[]);
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load upcoming events.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadEvents();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      aria-label="Upcoming community events"
      className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-8"
    >
      {isLoading ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading upcoming events...
        </p>
      ) : errorMessage ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMessage}
        </p>
      ) : events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            No upcoming events just yet
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
            Be the first to bring your community together by creating an event.
          </p>
          <Link
            href="/create-event"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Create an event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-52 bg-emerald-50 dark:bg-slate-800">
                <Image
                  src={event.thumbnailUrl}
                  alt={event.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm dark:bg-slate-900/90 dark:text-emerald-300">
                  {event.eventType}
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(event.eventDate))}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                  {event.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {event.description}
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0 text-emerald-700 dark:text-emerald-300"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
