import type { ChatInputCommandInteraction, User } from "discord.js";
import { pendingTitleTasks$ } from "../../queue.js";
import type { SinnerTitle, Title } from "../../constants.js";

export function getPendingTitleUsers(
  interaction: ChatInputCommandInteraction<"cached">,
  title?: Title | SinnerTitle | undefined | null
) {
  const pendingTitleTasks = pendingTitleTasks$.value.filter((task) =>
    title ? task.title === title : true
  );

  return pendingTitleTasks.reduce((prev, curr) => {
    const entry = prev[curr.title];

    if (entry) {
      prev[curr.title] = [
        ...entry,
        interaction.client.users.cache.get(curr.discordUserId),
      ];
    }

    prev[curr.title] = [interaction.client.users.cache.get(curr.discordUserId)];

    return prev;
  }, {} as Record<Title | SinnerTitle, Array<User | undefined>>);
}
