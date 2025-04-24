"use server";
import { createReference, prisma } from "@/lib/db";
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

export const updateBatch = async (data: { reference: string; id: string }) => {
  const { reference, id } = data;
  if (!reference) {
    return {
      success: false,
      message: "Reference is required",
    };
  }
  const batch = await prisma.batch.findFirst({
    where: {
      id,
    },
  });
  if (!batch) {
    return {
      success: false,
      message: "Batch not found",
    };
  }
  let ref = batch.reference;
  if (ref.slice(7) !== reference) {
    ref = createReference(reference);
  }
  await prisma.batch.update({
    where: {
      id,
    },
    data: {
      reference: ref,
    },
  });
  return {
    success: true,
    message: "Batch updated successfully",
  };
};
