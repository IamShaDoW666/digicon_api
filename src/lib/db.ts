import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
export const createReference = (ref: string) => {
    return "REF" + Math.floor(1000 + Math.random() * 9000).toString() + ref
}
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // optional: log queries for debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
