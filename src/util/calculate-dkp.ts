import type { Governor, GovernorDKP } from "@prisma/client";

export const calculateDkp = (
  governorDkp: GovernorDKP & { governor: Governor }
) => {
  const dkp =
    Number(governorDkp.tier4kpDifference) +
    Number(governorDkp.tier5kpDifference) * 2 +
    Number(governorDkp.deadDifference) * 3;

  const dkpNeeded = Number(governorDkp.governor.power) * 0.2;
  const dkpRemaining = Math.abs(dkpNeeded - dkp);

  return {
    governorID: governorDkp.governor.id,
    name: governorDkp.governor.nickname,
    power: Number(governorDkp.governor.power).toLocaleString("en-US"),
    powerDifference: Number(governorDkp.powerDifference).toLocaleString(
      "en-US"
    ),
    tier4kpDifference: Number(governorDkp.tier4kpDifference).toLocaleString(
      "en-US"
    ),
    tier5kpDifference: Number(governorDkp.tier5kpDifference).toLocaleString(
      "en-US"
    ),
    deadDifference: Number(governorDkp.deadDifference).toLocaleString("en-US"),
    dkp,
    dkpNeeded,
    dkpRemaining: Math.round(dkpRemaining * 10) / 10,
    percentageTowardsGoal:
      Math.round((dkp / dkpNeeded) * 100 * 100 + Number.EPSILON) / 100,
  };
};
