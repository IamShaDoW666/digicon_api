"use server";
import { prisma } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
export const deleteBatch = async (id: string) => {
  const batch = await prisma.batch.findFirst({
    where: { id },
    include: { media: true },
  });
  if (!batch) {
    return {
      success: false,
      message: "Batch not found",
    };
  }
  const mediaRecords = batch.media;
  const deleteFilePromises = mediaRecords.map(async (media) => {
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
  return {
    success: true,
    message: "Batch deleted successfully",
  };
};
