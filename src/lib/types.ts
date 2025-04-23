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
  time: string;
  iat: number;
  exp: number;
}

export const SessionPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  time: z.date(),
});
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
