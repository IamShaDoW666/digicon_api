import { sendError, sendSuccess } from "@/lib/network";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  //TODO: Check Auth
  const users = await prisma.user.findMany({ omit: { password: true } });
  if (!users) {
    return sendError("No users found", 404);
  }
  return sendSuccess(users, "Users found", 200);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return sendError("Invalid request", 400);
    }
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return sendError("Missing required fields", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return sendError("User already exists", 409);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    return sendSuccess(user, "User created", 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(error.message);
      return sendError(`Invalid Request`, 400);
    }
    console.error(error);
    return sendError("Internal server error", 500);
  }
}
