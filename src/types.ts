import { type Logger } from "pino";
import { type Device } from "adb-ts";
import type { PrismaClient } from "@prisma/client";

export interface AppContext {
  logger: Logger;
  device: Device;
  prisma: PrismaClient;
}
