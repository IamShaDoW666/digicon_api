import { sendError, sendSuccess } from "@/lib/network";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  //TODO: Check Auth
  const { id } = params;
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
  });
  if (!user) {
    return sendError("No user found", 404);
  }
  return sendSuccess(user, "Users found", 200);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body) {
      return sendError("Invalid request", 400);
    }
    const { name, email, password } = body;

    if (!name && !email && !password) {
      return sendError("Nothing to update", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return sendError("User not found", 409);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        password,
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
  // const user = await prisma.user.create({
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return sendError("Invalid request", 400);
    }
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return sendError("User not found", 409);
    }

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return sendSuccess(user, "User deleted", 200);
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", 500);
  }
}
