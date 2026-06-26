import { PrismaClient } from "@prisma/client";

type PrismaGlobal = typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = globalThis as PrismaGlobal;

export const getPrismaClient = (): PrismaClient => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
};
