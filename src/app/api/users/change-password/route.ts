import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware/withAuth";
import { sendError, sendSuccess } from "@/lib/network";
import bcrypt from "bcryptjs";

export const POST = withAuth(async (request) => {
  try {
    const req = await request.json();
    const userData = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    if (!userData) {
      return sendError("User not found", 404);
    }
    if (!req.newPassword) {
      return sendError("New password is required", 400);
    }
    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        password: bcrypt.hashSync(req.newPassword, 10),
      },
    });
    return sendSuccess(userData, "Password updated successfully", 200);
  } catch (error) {
    console.error(JSON.stringify(error));
    return sendError("Internal Server Error", 500);
  }
});
