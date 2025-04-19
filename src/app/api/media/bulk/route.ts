import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware/withAuth";
import { sendError, sendSuccess } from "@/lib/network";
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

export const DELETE = withAuth(async (request: NextRequest, user) => {
  try {
    const { mediaIds } = await request.json();
    if (!mediaIds || !Array.isArray(mediaIds)) {
      return sendError("Invalid media IDs", 400);
    }
    const mediaRecords = await prisma.media.findMany({
      where: {
        id: {
          in: mediaIds,
        },
      },
    });
    const deleteFilePromises = mediaRecords.map(async (media) => {
      const filePath = path.resolve(media.url); // Adjust if 'filepath' includes full path
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
    return sendSuccess(mediaIds, "Media deleted successfully", 204);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return sendError("Invalid JSON", 400);
  }
});
