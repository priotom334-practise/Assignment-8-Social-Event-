"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { eventTypes } from "@/lib/event-types";
import { authClient } from "@/lib/auth-client";

const maxThumbnailSize = 5 * 1024 * 1024;
const supportedThumbnailTypes = ["image/jpeg", "image/png", "image/webp"];

function getLocalDateTimeValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function updateEventTimeMinimum(
  dateInput: HTMLInputElement | null,
  timeInput: HTMLInputElement | null,
  dateValue: string,
) {
  if (!dateInput || !timeInput) return;

  const minimumDate = new Date();
  minimumDate.setMinutes(minimumDate.getMinutes() + 1, 0, 0);
  const [minimumDateValue, minimumTimeValue] =
    getLocalDateTimeValue(minimumDate).split("T");

  dateInput.min = minimumDateValue;
  timeInput.min = dateValue === minimumDateValue ? minimumTimeValue : "";
}

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const eventDateInputRef = useRef<HTMLInputElement>(null);
  const eventTimeInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    updateEventTimeMinimum(
      eventDateInputRef.current,
      eventTimeInputRef.current,
      "",
    );
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  function selectThumbnail(file: File | null) {
    setErrorMessage("");
    setThumbnailFile(null);
    setThumbnailPreview(null);

    if (!file) return;
    if (!supportedThumbnailTypes.includes(file.type)) {
      setErrorMessage("Choose a JPG, PNG, or WebP event image.");
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      return;
    }
    if (file.size > maxThumbnailSize) {
      setErrorMessage("Event images must be 5 MB or smaller.");
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      return;
    }

    setThumbnailFile(file);
    setThumbnailUrl("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setThumbnailPreview(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Unable to preview this image. Please choose another.");
    };
    reader.readAsDataURL(file);
  }

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
    selectThumbnail(event.currentTarget.files?.[0] ?? null);
  }

  function handleThumbnailDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsThumbnailDragging(false);
    selectThumbnail(event.dataTransfer.files[0] ?? null);
  }

  function clearThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setErrorMessage("");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const localEventDate = `${String(formData.get("eventDate") ?? "")}T${String(
      formData.get("eventTime") ?? "",
    )}`;
    const parsedEventDate = new Date(localEventDate);
    if (
      Number.isNaN(parsedEventDate.getTime()) ||
      parsedEventDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Choose an event date and time in the future.");
      setIsSubmitting(false);
      return;
    }

    try {
      formData.set("eventDate", parsedEventDate.toISOString());
      formData.delete("eventTime");
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const result: unknown = await response.json();
      const responseError =
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        typeof result.error === "string"
          ? result.error
          : undefined;

      if (!response.ok) {
        setErrorMessage(responseError ?? "Unable to create the event.");
        return;
      }

      setSuccessMessage(
        "Event created successfully. Redirecting to upcoming events...",
      );
      window.setTimeout(() => router.push("/upcoming-events"), 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the event. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="grid min-h-[calc(100svh-5rem)] flex-1 place-items-center bg-[#f5faf5] px-6 py-16 dark:bg-slate-950">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {isPending ? "Checking your account..." : "Redirecting to sign in..."}
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100svh-5rem)] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7f0] via-[#f8fbf8] to-[#e7f4eb] px-4 py-12 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-10 size-72 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-800/25"
      />
      <section
        aria-labelledby="create-event-heading"
        className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 p-6 shadow-[0_28px_90px_-32px_rgba(6,45,36,0.3)] backdrop-blur dark:border-slate-700 dark:bg-slate-900 sm:p-9"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-700"
        />
        <Link
          href="/upcoming-events"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          &larr; Upcoming events
        </Link>
        <div className="mt-6">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Bring your community together
          </p>
          <h1
            id="create-event-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white"
          >
            Create an event
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Share the details and invite your neighbors to make a difference.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="event-title"
              className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Event title
            </label>
            <input
              id="event-title"
              name="title"
              type="text"
              minLength={3}
              maxLength={120}
              required
              placeholder="e.g. Riverside Community Cleanup"
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="event-type"
              className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Event type
            </label>
            <select
              id="event-type"
              name="eventType"
              required
              defaultValue=""
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="" disabled>
                Select an event type
              </option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-date"
                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Event date
              </label>
              <input
                ref={eventDateInputRef}
                id="event-date"
                name="eventDate"
                type="date"
                required
                onChange={(event) =>
                  updateEventTimeMinimum(
                    eventDateInputRef.current,
                    eventTimeInputRef.current,
                    event.currentTarget.value,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="event-time"
                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Event time
              </label>
              <input
                ref={eventTimeInputRef}
                id="event-time"
                name="eventTime"
                type="time"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-description"
              className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Description
            </label>
            <textarea
              id="event-description"
              name="description"
              minLength={10}
              maxLength={5000}
              required
              rows={4}
              placeholder="Tell people what the event is about and how they can help."
              className="w-full resize-y rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="event-thumbnail-url"
              className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Event thumbnail
            </label>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsThumbnailDragging(true);
              }}
              onDragLeave={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setIsThumbnailDragging(false);
                }
              }}
              onDrop={handleThumbnailDrop}
              className={`rounded-2xl border border-dashed transition-colors ${
                isThumbnailDragging
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
                  : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-700"
              }`}
            >
              <input
                ref={thumbnailInputRef}
                id="event-thumbnail"
                name="thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailChange}
                aria-describedby="event-thumbnail-hint"
                className="sr-only"
              />
              {thumbnailFile ? (
                <div className="flex items-center gap-3 p-3">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 via-lime-400 to-emerald-700 p-0.5">
                    {thumbnailPreview ? (
                      <Image
                        src={thumbnailPreview}
                        alt="Selected event thumbnail preview"
                        width={64}
                        height={48}
                        unoptimized
                        className="size-16 rounded-[0.65rem] border-2 border-white object-cover dark:border-slate-800"
                      />
                    ) : (
                      <span className="grid size-16 place-items-center rounded-[0.65rem] bg-white text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-6"
                        >
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <circle cx="9" cy="10" r="2" />
                          <path d="m21 15-5-5L5 20" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {thumbnailFile.name}
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                      Ready to upload ·{" "}
                      {(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (thumbnailInputRef.current) {
                        thumbnailInputRef.current.value = "";
                        thumbnailInputRef.current.click();
                      }
                    }}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-slate-700"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    aria-label="Remove selected event thumbnail"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="size-4"
                    >
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="event-thumbnail"
                  className="flex cursor-pointer items-center gap-3 p-3.5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
                      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Choose a thumbnail image
                    </span>
                    <span
                      id="event-thumbnail-hint"
                      className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400"
                    >
                      Browse or drop a JPG, PNG, or WebP image
                    </span>
                  </span>
                  <span className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800">
                    Browse
                  </span>
                </label>
              )}
            </div>
            <p
              id={thumbnailFile ? "event-thumbnail-hint" : undefined}
              className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
            >
              Maximum file size: 5 MB.
            </p>
            <div className="my-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Or use a URL
              </span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <input
              id="event-thumbnail-url"
              name="thumbnailUrl"
              type="url"
              pattern="https?://.+"
              maxLength={2048}
              required={!thumbnailFile}
              value={thumbnailUrl}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setThumbnailUrl(value);
                if (value && thumbnailFile) {
                  clearThumbnail();
                  setThumbnailUrl(value);
                }
              }}
              placeholder="https://example.com/event-image.jpg"
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="event-location"
              className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Location
            </label>
            <input
              id="event-location"
              name="location"
              type="text"
              minLength={2}
              maxLength={200}
              required
              placeholder="e.g. Riverside Park, North Entrance"
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfb] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p
              role="status"
              className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || successMessage !== ""}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating event..."
              : successMessage
                ? "Event created"
                : "Create event"}
          </button>
        </form>
      </section>
    </main>
  );
}
