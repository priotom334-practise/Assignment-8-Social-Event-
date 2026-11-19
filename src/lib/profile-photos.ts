import "server-only";

import { GridFSBucket } from "mongodb";
import { mongoClient } from "@/lib/auth";

export const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024;
export const profilePhotoBucket = new GridFSBucket(mongoClient.db(), {
  bucketName: "profilePhotos",
});

export type ProfilePhotoContentType =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

export function detectProfilePhotoContentType(
  buffer: Buffer,
): ProfilePhotoContentType | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export function isProfilePhotoContentType(
  value: unknown,
): value is ProfilePhotoContentType {
  return value === "image/jpeg" || value === "image/png" || value === "image/webp";
}

export function getGridFsProfilePhotoId(image: string | null | undefined) {
  const match = image?.match(/^\/api\/profile\/avatar\/([a-f\d]{24})$/i);
  return match ? match[1] : null;
}
