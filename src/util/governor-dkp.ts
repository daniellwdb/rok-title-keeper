import type { Governor, PrismaClient } from "@prisma/client";

export const updateGovernorDKP = async (
  prisma: PrismaClient,
  governor: Omit<Governor, "createdAt" | "updatedAt">
) => {
  const existingGovernorDkp = await prisma.governorDKP.findFirst({
    where: {
      governorID: governor.id,
    },
    include: {
      governor: true,
    },
  });

  if (existingGovernorDkp) {
    return prisma.governorDKP.update({
      where: {
        id: existingGovernorDkp.id,
      },
      data: {
        powerDifference: (
          Number(governor.power) - Number(existingGovernorDkp.governor.power)
        ).toString(),
        tier4kpDifference: (
          Number(governor.tier4kp) -
          Number(existingGovernorDkp.governor.tier4kp)
        ).toString(),
        tier5kpDifference: (
          Number(governor.tier5kp) -
          Number(existingGovernorDkp.governor.tier5kp)
        ).toString(),
        deadDifference: (
          Number(governor.dead) - Number(existingGovernorDkp.governor.dead)
        ).toString(),
      },
    });
  }

  return prisma.governorDKP.create({
    data: {
      powerDifference: "0",
      tier4kpDifference: "0",
      tier5kpDifference: "0",
      deadDifference: "0",
      governor: {
        connectOrCreate: {
          where: {
            id: governor.id,
          },
          create: governor,
        },
      },
    },
  });
};

export const upsertGovernorDKP = async (
  prisma: PrismaClient,
  governor: Omit<Governor, "createdAt" | "updatedAt">,
  resetPower: boolean,
  resetKp: boolean
) => {
  await prisma.governor.upsert({
    where: {
      id: governor.id,
    },
    create: governor,
    update: {
      nickname: governor.nickname,
      ...(resetPower && { power: governor.power }),
      ...(resetKp && {
        kp: governor.kp,
        tier1kp: governor.tier1kp,
        tier2kp: governor.tier2kp,
        tier3kp: governor.tier3kp,
        tier4kp: governor.tier4kp,
        tier5kp: governor.tier5kp,
        dead: governor.dead,
        resourceAssistance: governor.resourceAssistance,
      }),
      governorDkp: {
        upsert: {
          update: {
            ...(resetPower && { powerDifference: "0" }),
            ...(resetKp && {
              tier4kpDifference: "0",
              tier5kpDifference: "0",
              deadDifference: "0",
            }),
          },
          create: {
            powerDifference: "0",
            tier4kpDifference: "0",
            tier5kpDifference: "0",
            deadDifference: "0",
          },
        },
      },
    },
  });
};
