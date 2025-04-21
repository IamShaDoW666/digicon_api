import { NextRequest } from "next/server";
import { sendError, sendSuccess } from "@/lib/network";
import { createReference, prisma } from "@/lib/db";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { withAuth } from "@/lib/middleware/withAuth";

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: { media: true, createdBy: true },
    });
    if (!batches) {
      return sendError("No batches found", 404);
    }
    return sendSuccess(batches, "Batches found", 200);
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", 500);
  }
}

export const POST = withAuth(async (request: NextRequest, user) => {
  const formData = await request.formData();
  const images = formData.getAll("images") as File[];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploaded: { file: string; filepath: string }[] = [];
  await fs.promises.mkdir(uploadDir, { recursive: true });
  if (!images.length) {
    return sendError("No images found", 400);
  }
  for (const image of images) {
    // Read the file into a Buffer
    try {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Compress with Sharp: resize + JPEG quality
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize to max width 1024px :contentReference[oaicite:6]{index=6}
        .jpeg({ quality: 80 }) // Compress JPEG to 80% quality :contentReference[oaicite:7]{index=7}
        .toBuffer(); // Get processed Buffer :contentReference[oaicite:8]{index=8}

      // Define output filename and path
      const fileName = `${Date.now()}-${image.name}`.replace(/\s+/g, "");
      const filePath = path.join(uploadDir, fileName);
      // Write the compressed image to disk
      await fs.promises.writeFile(filePath, optimizedBuffer); // Save optimized image :contentReference[oaicite:9]{index=9}
      // Record the public URL
      uploaded.push({ file: image.name, filepath: `/uploads/${fileName}` });
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }
  const ref = createReference(formData.get("reference") as string);
  try {
    const batch = await prisma.batch.create({
      data: {
        name: `BULK_${Date.now()}${ref}`,
        reference: ref,
        media: {
          createMany: {
            data: uploaded.map((file) => {
              return {
                title: file.file,
                type: "UPLOAD",
                url: file.filepath,
                reference: `REF${Date.now()}${file.file}`,
                uploadedUserId: user.id,
              };
            }),
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        media: true,
      },
    });
    return sendSuccess(batch, "Batch created", 200);
  } catch (error) {
    uploaded.forEach(async (file) => {
      const filePath = path.join(uploadDir, file.filepath);
      try {
        await fs.promises.unlink(filePath); // Delete the file if batch creation fails
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    });
    console.error("Error creating batch:", error);
    return sendError("Internal server error", 500);
  }
});

export const PUT = withAuth(async (request: NextRequest, user) => {
  const formData = await request.formData();
  const images = formData.getAll("images") as File[];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploaded: { file: string; filepath: string }[] = [];
  const batchId = formData.get("batchId") as string;

  if (!images.length && !formData.get("reference")) {
    return sendError("Nothing to update", 400);
  }
  if (!batchId) {
    return sendError("Batch ID is required", 400);
  }
  const batch = await prisma.batch.findUnique({
    where: {
      id: batchId,
    },
  });

  if (!batch) {
    return sendError("Batch not found", 404);
  }

  for (const image of images) {
    // Read the file into a Buffer
    try {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Compress with Sharp: resize + JPEG quality
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize to max width 1024px :contentReference[oaicite:6]{index=6}
        .jpeg({ quality: 80 }) // Compress JPEG to 80% quality :contentReference[oaicite:7]{index=7}
        .toBuffer(); // Get processed Buffer :contentReference[oaicite:8]{index=8}

      // Define output filename and path
      const fileName = `${Date.now()}-${image.name}`.replace(/\s+/g, "");
      const filePath = path.join(uploadDir, fileName);
      // Write the compressed image to disk
      await fs.promises.writeFile(filePath, optimizedBuffer); // Save optimized image :contentReference[oaicite:9]{index=9}
      // Record the public URL
      uploaded.push({ file: image.name, filepath: `/uploads/${fileName}` });
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }
  let ref = batch.reference;
  if (ref.slice(7) !== formData.get("reference")) {
    ref = createReference(formData.get("reference") as string);
  }
  try {
    const updatedBatch = await prisma.batch.update({
      where: {
        id: batchId,
      },
      data: {
        name: `BULK_${Date.now()}${ref}`,
        reference: ref,
        media: {
          createMany: {
            data: uploaded.map((file) => {
              return {
                title: file.file,
                type: "UPLOAD",
                url: file.filepath,
                reference: `REF${Date.now()}${file.file}`,
                uploadedUserId: user.id,
              };
            }),
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        media: true,
      },
    });
    return sendSuccess(updatedBatch, "Batch updated", 200);
  } catch (error) {
    uploaded.forEach(async (file) => {
      const filePath = path.join(uploadDir, file.filepath);
      try {
        await fs.promises.unlink(filePath); // Delete the file if batch creation fails
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    });
    console.error("Error creating batch:", error);
    return sendError("Internal server error", 500);
  }
});
