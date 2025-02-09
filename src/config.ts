import { z } from "zod";
import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schema = z.object({
  DISCORD_TOKEN: z.string(),
  HOME_KINGDOM: z.string(),
  LOST_KINGDOM: z.string(),
  ANIMATION_DELAY: z.string(),
  THEME_COLOUR: z.string().optional(),
  DISCORD_DEV_GUILD: z.string().optional(),
  EMULATOR_INSTANCE_NAME: z.string().optional(),
  BLUESTACKS_EXECUTABLE: z.string(),
  REBOOT_INTERVAL: z.number().int().optional(),
  REBOOT_CHANNEL_IDS: z.array(z.string()),
  MARK_DONE_USER_IDS: z.array(z.string()),
  CURRENT_DKP_EXPRESSION: z.string(),
  REQUIRED_DKP_EXPRESSION: z.string(),
  // Messages
  GOVERNOR_PROFILES_NOT_FOUND_MESSAGE: z.string(),
  GOVERNOR_PROFILE_WITH_ID_NOT_FOUND_MESSAGE: z.string(),
  PROFILE_LINK_SUCCESSFUL_MESSAGE: z.string(),
  SCAN_STARTED_MESSAGE: z.string(),
  TITLE_LIMIT_MESSAGE: z.string(),
  TITLE_BUFF_LOCKED_MESSAGE: z.string(),
  TITLE_REQUESTED_MESSAGE: z.string(),
  TITLE_RECEIVED_MESSAGE: z.string(),
  TITLE_PROVIDE_COORDINATES: z.string(),
  TITLE_PROVIDE_KINGDOM: z.string(),
  TITLE_PROVIDE_KINGDOM_AND_COORDINATES: z.string(),
  TITLE_NOT_REQUESTED: z.string(),
  TITLE_X_NOT_A_NUMBER: z.string(),
  TITLE_Y_NOT_A_NUMBER: z.string(),
  VERIFICATION_NOT_REQUIRED_MESSAGE: z.string(),
  PROVIDE_POSITIONS_MESSAGE: z.string(),
  NO_VALID_RESPONSE_MESSAGE: z.string(),
  VERIFICATION_FAILED_MESSAGE: z.string(),
  VERIFICATION_SUCCESS_MESSAGE: z.string(),
  GOVERNOR_NOT_FOUND_MESSAGE: z.string(),
  REBOOT_STARTED: z.string(),
  REBOOT_FINISHED: z.string(),
  REBOOT_PENDING: z.string(),
  NO_TITLE_REQUESTED: z.string(),
  TITLE_REQUEST_CANCELLED: z.string(),
  NO_COORDS_SAVED: z.string(),
  BOT_STATE_UPDATED: z.string(),
  BOT_STATE_PAUSED: z.string(),
});

const result = schema.safeParse(
  parse(readFileSync(join(process.cwd(), "config.yml"), "utf8"))
);

if (!result.success) {
  throw new Error(result.error.message);
}

export const config = result.data;
