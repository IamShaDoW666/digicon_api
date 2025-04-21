import { sendError, sendSuccess } from "@/lib/network";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return sendError("No token provided", 401);
  }
  return jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return sendError("Invalid token", 401);
    }
    return sendSuccess(decoded, "Token is valid", 200);
  });
}
