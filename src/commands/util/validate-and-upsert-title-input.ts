import { type Snowflake } from "discord.js";
import { GovernorType, Kingdom } from "../../constants.js";
import type { AppContext } from "../../types.js";
import { config } from "../../config.js";
import { interpolate } from "../../util/interpolate.js";

interface TitleInput extends AppContext {
  discordUserId: Snowflake;
  kingdomType: Kingdom | undefined;
  x: number | null;
  y: number | null;
  governorType: GovernorType;
}

export async function validateAndUpsertTitleInput({
  discordUserId,
  kingdomType,
  x,
  y,
  governorType,
  prisma,
}: TitleInput) {
  const hasProvidedCoordinates = x && y;

  if (kingdomType && !hasProvidedCoordinates) {
    return {
      ok: false,
      message: config.TITLE_PROVIDE_COORDINATES,
    } as const;
  }

  if (hasProvidedCoordinates && !kingdomType) {
    return {
      ok: false,
      message: config.TITLE_PROVIDE_KINGDOM,
    } as const;
  }

  if ((x && !y) || (y && !x)) {
    return {
      ok: false,
      message: config.TITLE_PROVIDE_KINGDOM_AND_COORDINATES,
    } as const;
  }

  if (Number.isNaN(x)) {
    return {
      ok: false,
      message: interpolate(config.TITLE_X_NOT_A_NUMBER, { kingdomType, x, y }),
    } as const;
  }

  if (Number.isNaN(y)) {
    return {
      ok: false,
      message: interpolate(config.TITLE_Y_NOT_A_NUMBER, { kingdomType, x, y }),
    } as const;
  }

  const titleBuffRequestInput = {
    discordUserId,
    // Validated in titleBuffRequestWhereArgs
    kingdomType: kingdomType!,
    governorType,
  };

  const titleBuffRequestWhereArgs = kingdomType
    ? titleBuffRequestInput
    : {
        OR: [
          {
            ...titleBuffRequestInput,
            kingdomType: Kingdom.HOME,
          },
          {
            ...titleBuffRequestInput,
            kingdomType: Kingdom.LOST,
          },
        ],
      };

  const titleBuffRequest = await prisma.titleBuffRequest.findFirst({
    where: {
      ...titleBuffRequestWhereArgs,
    },
  });

  if (!kingdomType && !hasProvidedCoordinates && !titleBuffRequest) {
    return {
      ok: false,
      message: config.TITLE_NOT_REQUESTED,
    } as const;
  }

  const kingdom = kingdomType ?? titleBuffRequest?.kingdomType;

  const lastInsertedTitleBuffRequest = await prisma.titleBuffRequest.upsert({
    where: {
      discordUserId_governorType: {
        discordUserId,
        governorType,
      },
    },
    create: {
      discordUserId,
      kingdomType: kingdom!,
      x: x ?? titleBuffRequest!.x,
      y: y ?? titleBuffRequest!.y,
      governorType,
    },
    update: {
      kingdomType: kingdom!,
      x: x ?? titleBuffRequest!.x,
      y: y ?? titleBuffRequest!.y,
    },
    select: {
      discordUserId: true,
      kingdomType: true,
      governorType: true,
      x: true,
      y: true,
    },
  });

  return {
    ok: true,
    ...lastInsertedTitleBuffRequest,
  } as const;
}
