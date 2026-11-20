This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

Authentication uses Better Auth with MongoDB for email/password accounts and Google sign-in. Configure these values in `.env`:

- `BETTER_AUTH_URL` — the app's public base URL (for local development, `http://localhost:3000`)
- `BETTER_AUTH_SECRET` — a private, randomly generated secret of at least 32 characters
- `MONGODB_URI` — the MongoDB connection string
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

Add `${BETTER_AUTH_URL}/api/auth/callback/google` as an authorized redirect URI in the Google OAuth client. Keep all secret values out of source control.

Profile photos are stored in the same MongoDB database using GridFS. Uploads accept JPG, PNG, and WebP files up to 5 MB.

## Events

Signed-in users can create community events with a future date and time. Event records are stored in the MongoDB `events` collection, including the creator's email and user ID. Upcoming events are listed on the Upcoming Events page.

Event thumbnails can be uploaded as JPG, PNG, or WebP files up to 5 MB, or supplied as an image URL. Uploaded thumbnails are stored in MongoDB GridFS.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
