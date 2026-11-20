import "server-only";

import { GridFSBucket } from "mongodb";
import { mongoClient } from "@/lib/auth";

export const eventThumbnailBucket = new GridFSBucket(mongoClient.db(), {
  bucketName: "eventThumbnails",
});
