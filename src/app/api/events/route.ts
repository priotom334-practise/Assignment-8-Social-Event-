import { auth, authOrigin } from "@/lib/auth";
import { eventTypes, type EventType } from "@/lib/event-types";
import { eventThumbnailBucket } from "@/lib/event-thumbnails";
import { eventsCollection } from "@/lib/events";
import {
  detectProfilePhotoContentType,
  MAX_PROFILE_PHOTO_SIZE,
} from "@/lib/profile-photos";
import { ObjectId } from "mongodb";

function isImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isEventType(value: unknown): value is EventType {
  return (
    typeof value === "string" &&
    eventTypes.some((eventType) => eventType === value)
  );
}

export async function GET() {
  try {
    const events = await eventsCollection
      .find({ eventDate: { $gt: new Date() } })
      .sort({ eventDate: 1 })
      .limit(100)
      .toArray();

    return Response.json({
      events: events.map((event) => ({
        id: event._id.toHexString(),
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        thumbnailUrl: event.thumbnailUrl,
        location: event.location,
        eventDate: event.eventDate.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Unable to load upcoming events.", error);
    return Response.json(
      { error: "Unable to load upcoming events." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== authOrigin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json(
      { error: "Please log in to create an event." },
      { status: 401 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_PROFILE_PHOTO_SIZE + 128 * 1024) {
    return Response.json(
      { error: "Event thumbnails must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.formData();
  } catch {
    return Response.json({ error: "Invalid event form data." }, { status: 400 });
  }

  if (!(payload instanceof FormData)) {
    return Response.json({ error: "Invalid event form data." }, { status: 400 });
  }

  const title =
    typeof payload.get("title") === "string"
      ? String(payload.get("title")).trim()
      : "";
  const description =
    typeof payload.get("description") === "string"
      ? String(payload.get("description")).trim()
      : "";
  const eventType = payload.get("eventType");
  const thumbnailUrl =
    typeof payload.get("thumbnailUrl") === "string"
      ? String(payload.get("thumbnailUrl")).trim()
      : "";
  const location =
    typeof payload.get("location") === "string"
      ? String(payload.get("location")).trim()
      : "";
  const eventDateValue = payload.get("eventDate");
  const thumbnailEntry = payload.get("thumbnail");
  if (thumbnailEntry !== null && !(thumbnailEntry instanceof File)) {
    return Response.json({ error: "Choose a valid image file." }, { status: 400 });
  }
  const thumbnail =
    thumbnailEntry instanceof File && thumbnailEntry.size > 0
      ? thumbnailEntry
      : null;

  if (title.length < 3 || title.length > 120) {
    return Response.json(
      { error: "Title must be between 3 and 120 characters." },
      { status: 400 },
    );
  }
  if (description.length < 10 || description.length > 5000) {
    return Response.json(
      { error: "Description must be between 10 and 5,000 characters." },
      { status: 400 },
    );
  }
  if (!isEventType(eventType)) {
    return Response.json({ error: "Choose a valid event type." }, { status: 400 });
  }
  if (
    !thumbnail &&
    (thumbnailUrl.length > 2048 || !isImageUrl(thumbnailUrl))
  ) {
    return Response.json(
      { error: "Choose a thumbnail image or enter a valid image URL." },
      { status: 400 },
    );
  }
  if (thumbnail && thumbnail.size > MAX_PROFILE_PHOTO_SIZE) {
    return Response.json(
      { error: "Event thumbnails must be 5 MB or smaller." },
      { status: 413 },
    );
  }
  if (location.length < 2 || location.length > 200) {
    return Response.json(
      { error: "Location must be between 2 and 200 characters." },
      { status: 400 },
    );
  }
  if (typeof eventDateValue !== "string") {
    return Response.json({ error: "Choose an event date." }, { status: 400 });
  }

  const eventDate = new Date(eventDateValue);
  if (
    Number.isNaN(eventDate.getTime()) ||
    eventDate.getTime() <= Date.now()
  ) {
    return Response.json(
      { error: "The event date must be in the future." },
      { status: 400 },
    );
  }

  let newThumbnailId: ObjectId | null = null;
  try {
    let storedThumbnailUrl = thumbnailUrl;
    if (thumbnail) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const contentType = detectProfilePhotoContentType(buffer);
      if (!contentType || contentType !== thumbnail.type) {
        return Response.json(
          { error: "Upload a valid JPG, PNG, or WebP image." },
          { status: 415 },
        );
      }

      const uploadStream = eventThumbnailBucket.openUploadStream(
        `event-thumbnail-${session.user.id}-${Date.now()}`,
        {
          metadata: {
            userId: session.user.id,
            contentType,
          },
        },
      );
      newThumbnailId = uploadStream.id;
      await new Promise<void>((resolve, reject) => {
        uploadStream.once("error", reject);
        uploadStream.once("finish", resolve);
        uploadStream.end(buffer);
      });
      storedThumbnailUrl = `/api/events/images/${newThumbnailId.toHexString()}`;
    }

    const result = await eventsCollection.insertOne({
      title,
      description,
      eventType,
      thumbnailUrl: storedThumbnailUrl,
      location,
      eventDate,
      createdByEmail: session.user.email,
      createdByUserId: session.user.id,
      createdAt: new Date(),
    });

    return Response.json(
      { success: true, eventId: result.insertedId.toHexString() },
      { status: 201 },
    );
  } catch (error) {
    if (newThumbnailId) {
      try {
        const [newThumbnail] = await eventThumbnailBucket
          .find({ _id: newThumbnailId })
          .limit(1)
          .toArray();
        if (newThumbnail) await eventThumbnailBucket.delete(newThumbnailId);
      } catch (cleanupError) {
        console.error("Unable to clean up the failed event thumbnail.", cleanupError);
      }
    }
    console.error("Unable to create event.", error);
    return Response.json(
      { error: "Unable to create the event. Please try again." },
      { status: 500 },
    );
  }
}
