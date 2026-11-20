import "server-only";

import { mongoClient } from "@/lib/auth";
import type { EventType } from "@/lib/event-types";

export interface EventRecord {
  title: string;
  description: string;
  eventType: EventType;
  thumbnailUrl: string;
  location: string;
  eventDate: Date;
  createdByEmail: string;
  createdByUserId: string;
  createdAt: Date;
}

export const eventsCollection =
  mongoClient.db().collection<EventRecord>("events");
