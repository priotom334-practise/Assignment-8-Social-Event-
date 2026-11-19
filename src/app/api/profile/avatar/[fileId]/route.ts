import { profilePhotoBucket, isProfilePhotoContentType } from "@/lib/profile-photos";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  context: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await context.params;
  if (!/^[a-f\d]{24}$/i.test(fileId)) {
    return new Response(null, { status: 404 });
  }

  const id = new ObjectId(fileId);
  try {
    const [file] = await profilePhotoBucket
      .find({ _id: id })
      .limit(1)
      .toArray();

    if (!file || !isProfilePhotoContentType(file.metadata?.contentType)) {
      return new Response(null, { status: 404 });
    }

    const stream = profilePhotoBucket.openDownloadStream(id);
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.once("end", () => controller.close());
        stream.once("error", (error) => controller.error(error));
      },
      cancel() {
        stream.destroy();
      },
    });

    return new Response(body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
        "Content-Type": file.metadata.contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to load the profile photo.", error);
    return Response.json(
      { error: "Unable to load the profile photo." },
      { status: 500 },
    );
  }
}
