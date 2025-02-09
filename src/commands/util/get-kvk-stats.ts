import type { Governor } from "@prisma/client";
import { config } from "../../config.js";
import { evaluate } from "mathjs";

export function getKvkStats(
  oldGovernor: Governor,
  newGovernor: Omit<Governor, "createdAt" | "updatedAt">
) {
  const powerDifference = Number(newGovernor.power) - Number(oldGovernor.power);
  const tier4KillsDifference =
    Number(newGovernor.tier4Kills) - Number(oldGovernor.tier4Kills);
  const tier5KillsDifference =
    Number(newGovernor.tier5Kills) - Number(oldGovernor.tier5Kills);
  const deadDifference = Number(newGovernor.dead) - Number(oldGovernor.dead);
  const scope = {
    ...newGovernor,
    powerDifference,
    tier4KillsDifference,
    tier5KillsDifference,
    deadDifference,
  };
  const nonNullableScope = Object.fromEntries(
    Object.entries(scope).map(([key, value]) => [key, value ?? 0])
  );
  const currentDkp = evaluate(config.CURRENT_DKP_EXPRESSION, nonNullableScope);
  const requiredDkp = evaluate(
    config.REQUIRED_DKP_EXPRESSION,
    nonNullableScope
  );
  const percentageTowardsDkpGoal =
    Math.round((currentDkp / requiredDkp) * 100 * 100 + Number.EPSILON) / 100;

  return {
    governorID: newGovernor.id,
    nickname: newGovernor.nickname,
    alliance: newGovernor.alliance,
    power: Number(newGovernor.power).toLocaleString("en-US"),
    powerDifference: powerDifference.toLocaleString("en-US"),
    tier4KillsDifference: tier4KillsDifference.toLocaleString("en-US"),
    tier5KillsDifference: tier5KillsDifference.toLocaleString("en-US"),
    deadDifference: deadDifference.toLocaleString("en-US"),
    currentDkp: currentDkp.toString(),
    requiredDkp: requiredDkp.toString(),
    remainingDkp: Math.abs(requiredDkp - currentDkp).toString(),
    percentageTowardsDkpGoal: `${
      percentageTowardsDkpGoal > 100 ? 100 : percentageTowardsDkpGoal
    }%`,
  };
}
