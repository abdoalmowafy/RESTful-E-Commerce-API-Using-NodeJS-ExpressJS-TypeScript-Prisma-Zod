import { PrismaClient } from "@prisma/client";

export const globalClient = new PrismaClient();

export default globalClient;