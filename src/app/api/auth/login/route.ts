import { prisma } from "@/lib/db";
import { sendError, sendSuccess } from "@/lib/network";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return sendError("Username and password are required", 400);
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return sendError("Email not found", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return sendError("Invalid credentials", 401);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, time: new Date().toLocaleString() },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    return sendSuccess({ token, user }, "Login successful", 200);
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", 500);
  }
}
