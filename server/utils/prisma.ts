// server/utils/prisma.ts
import { PrismaClient } from "~~/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Single instance across requests. The driver adapter uses your pooled DATABASE_URL.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });