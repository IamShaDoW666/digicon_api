import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseResponse<T = any> {
  status: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  error?: any;
}

export interface UserAuth {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  profile?: string;
  phone?: string;
  time: string;
  iat: number;
  exp: number;
}

export const SessionPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  profile: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
  phone: z.string().optional(),
  time: z.date(),
});
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
