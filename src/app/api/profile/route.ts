import { auth, authOrigin } from "@/lib/auth";
import {
  detectProfilePhotoContentType,
  getGridFsProfilePhotoId,
  MAX_PROFILE_PHOTO_SIZE,
  profilePhotoBucket,
} from "@/lib/profile-photos";
import { ObjectId } from "mongodb";

const MAX_NAME_LENGTH = 80;

export async function PATCH(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== authOrigin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_PROFILE_PHOTO_SIZE + 128 * 1024) {
    return Response.json(
      { error: "Profile photos must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to update your profile." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid profile form data." }, { status: 400 });
  }

  const nameEntry = formData.get("name");
  if (typeof nameEntry !== "string") {
    return Response.json({ error: "A profile name is required." }, { status: 400 });
  }

  const name = nameEntry.trim();
  if (name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return Response.json(
      { error: "Name must be between 2 and 80 characters." },
      { status: 400 },
    );
  }

  const photoEntry = formData.get("photo");
  if (photoEntry !== null && !(photoEntry instanceof File)) {
    return Response.json({ error: "Choose a valid image file." }, { status: 400 });
  }

  const photo =
    photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  if (photo && photo.size > MAX_PROFILE_PHOTO_SIZE) {
    return Response.json(
      { error: "Profile photos must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  let newPhotoId: ObjectId | null = null;
  try {
    let image: string | undefined;
    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const contentType = detectProfilePhotoContentType(buffer);
      if (!contentType || contentType !== photo.type) {
        return Response.json(
          { error: "Upload a valid JPG, PNG, or WebP image." },
          { status: 415 },
        );
      }

      const uploadStream = profilePhotoBucket.openUploadStream(
        `profile-${session.user.id}-${Date.now()}`,
        {
          metadata: {
            userId: session.user.id,
            contentType,
          },
        },
      );
      newPhotoId = uploadStream.id;
      await new Promise<void>((resolve, reject) => {
        uploadStream.once("error", reject);
        uploadStream.once("finish", resolve);
        uploadStream.end(buffer);
      });
      image = `/api/profile/avatar/${newPhotoId.toHexString()}`;
    }

    const updatedUser = await auth.api.updateUser({
      headers: request.headers,
      body: {
        name,
        ...(image ? { image } : {}),
      },
    });

    if (!updatedUser.status) {
      throw new Error("The authentication provider did not update the profile.");
    }

    const previousPhotoId = getGridFsProfilePhotoId(session.user.image);
    if (newPhotoId && previousPhotoId && previousPhotoId !== newPhotoId.toHexString()) {
      const previousId = new ObjectId(previousPhotoId);
      try {
        const [previousFile] = await profilePhotoBucket
          .find({ _id: previousId })
          .limit(1)
          .toArray();
        if (previousFile?.metadata?.userId === session.user.id) {
          await profilePhotoBucket.delete(previousId);
        }
      } catch (error) {
        console.error("Unable to remove the previous profile photo.", error);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    if (newPhotoId) {
      try {
        const [newFile] = await profilePhotoBucket
          .find({ _id: newPhotoId })
          .limit(1)
          .toArray();
        if (newFile) await profilePhotoBucket.delete(newPhotoId);
      } catch (cleanupError) {
        console.error("Unable to clean up the failed profile photo upload.", cleanupError);
      }
    }

    console.error("Unable to update the user profile.", error);
    return Response.json(
      { error: "Unable to update your profile. Please try again." },
      { status: 500 },
    );
  }
}
