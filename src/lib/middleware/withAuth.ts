import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendError } from "../network";
import { UserAuth } from "../types";

export type AuthenticatedHandler = (
  req: NextRequest,
  payload: UserAuth
) => Promise<NextResponse> | NextResponse;

// Load your secret from env
const SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization"); // fetch header :contentReference[oaicite:2]{index=2}
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // strip “Bearer ” :contentReference[oaicite:3]{index=3}
    let payload: UserAuth;
    try {
      payload = jwt.verify(token, SECRET) as UserAuth; // verify & decode :contentReference[oaicite:4]{index=4}
    } catch (err) {
      console.log(err);
      return sendError("Unauthenticated", 401); // handle error :contentReference[oaicite:5]{index=5}
    }

    // Delegate to your actual handler with the decoded payload
    return handler(req, payload);
  };
}
