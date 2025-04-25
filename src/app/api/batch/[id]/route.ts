import { NextRequest } from "next/server";
import { sendError, sendSuccess } from "@/lib/network";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware/withAuth";
import path from "path";
import fs from "fs/promises";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!id) {
      return sendError("Batch ID is required", 400);
    }
    const batch = await prisma.batch.findFirst({
      where: { id },
    });
    if (!batch) {
      return sendError("Batch not found", 404);
    }
    return sendSuccess(batch, "Batch found", 200);
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", 500);
  }
};

export const DELETE = withAuth(async (request: NextRequest) => {
  const id = request.nextUrl.pathname.split("batch/").at(-1);
  if (!id) {
    return sendError("Batch ID is required", 400);
  }
  const batch = await prisma.batch.findFirst({
    where: { id },
    include: { media: true },
  });
  if (!batch) {
    return sendError("Batch not found", 404);
  }
  const mediaRecords = batch.media;
  const deleteFilePromises = mediaRecords.map(async (media) => {
    // const filePath = path.resolve(media.url); // Adjust if 'filepath' includes full path
    const filePath = path.join(process.cwd(), "public", media.url);
    try {
      await fs.unlink(filePath);
      await prisma.media.delete({
        where: {
          id: media.id,
        },
      });
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
      // Optionally handle specific errors, e.g., file not found
    }
  });
  await Promise.all(deleteFilePromises);
  await prisma.batch.delete({
    where: {
      id,
    },
  });
  return sendSuccess(id, "Batch deleted successfully", 200);
});
