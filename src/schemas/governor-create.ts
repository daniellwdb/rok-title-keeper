import { Prisma } from "@prisma/client";
import { z, Schema } from "zod";

export const GovernorCreateSchema: Schema<Prisma.GovernorCreateInput> =
  z.object({
    id: z.string(),
    nickname: z.string(),
    alliance: z.string(),
    power: z.string(),
    killPoints: z.string(),
    tier1Kills: z.string(),
    tier2Kills: z.string(),
    tier3Kills: z.string(),
    tier4Kills: z.string().nullable(),
    tier5Kills: z.string().nullable(),
    dead: z.string(),
    resourceAssistance: z.string(),
  });
