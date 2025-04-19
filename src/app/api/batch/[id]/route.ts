import { NextRequest } from "next/server";
import { sendError, sendSuccess } from "@/lib/network";
import { prisma } from "@/lib/db";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
}
