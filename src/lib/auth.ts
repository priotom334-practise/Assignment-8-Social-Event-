import "server-only";

import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const mongoUri = requiredEnv("MONGODB_URI");
const baseURL = requiredEnv("BETTER_AUTH_URL");
const trustedOrigin = new URL(baseURL).origin;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s])(?!.*\s).{6,}$/;

const globalForMongo = globalThis as typeof globalThis & {
  communityCareMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.communityCareMongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.communityCareMongoClient = mongoClient;
}

export const auth = betterAuth({
  appName: "CommunityCare",
  baseURL,
  secret: requiredEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [trustedOrigin],
  database: mongodbAdapter(mongoClient.db()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: requiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    },
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") return;

      const requestBody = context.body;
      const password =
        typeof requestBody === "object" &&
        requestBody !== null &&
        "password" in requestBody
          ? requestBody.password
          : undefined;

      if (typeof password !== "string" || !passwordPattern.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be at least 6 characters and include an uppercase letter, a lowercase letter, and a special character.",
        });
      }
    }),
  },
});
