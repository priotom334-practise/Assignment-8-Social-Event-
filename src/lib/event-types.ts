export const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Drive",
  "Community Gathering",
  "Other",
] as const;

export type EventType = (typeof eventTypes)[number];

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}
