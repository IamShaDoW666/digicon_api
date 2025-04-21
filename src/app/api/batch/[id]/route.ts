import { NextRequest } from "next/server";
import { sendError, sendSuccess } from "@/lib/network";
import { prisma } from "@/lib/db";
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
