import { NextResponse } from "next/server";
import type { BaseResponse } from "@/lib/types";

// Success Response
export function sendSuccess<T>(data: T, message = "Success", statusCode = 200) {
  const response: BaseResponse<T> = {
    status: true,
    statusCode,
    data,
    message,
  };
  return NextResponse.json(response, {
    status: statusCode,
  });
}

// Error Response
export function sendError(
  message = "Something went wrong",
  statusCode = 500,
  error?: any
) {
  const response: BaseResponse = {
    status: false,
    statusCode,
    message,
    error,
  };
  return NextResponse.json(response, {
    status: statusCode,
  });
}
