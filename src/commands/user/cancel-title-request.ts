import { ApplicationCommandType } from "discord.js";
import { createCommand } from "../util/create-command.js";
import { cancelledTitleTasks$, pendingTitleTasks$ } from "../../queue.js";

export const cancelUserContextMenuCommand = createCommand({
  type: ApplicationCommandType.User,
  name: "Cancel Title Request",
  execute(interaction) {
    const pendingTitleTask = pendingTitleTasks$.value.find(
      (task) => task.discordUserId === interaction.targetUser.id
    );

    if (!pendingTitleTask) {
      return void interaction.reply({
        content: "This user did not request a title yet.",
        ephemeral: true,
      });
    }

    cancelledTitleTasks$.next([
      ...cancelledTitleTasks$.value,
      interaction.targetUser.id,
    ]);

    pendingTitleTasks$.next(
      pendingTitleTasks$.value.filter(
        (task) => task.discordUserId !== interaction.targetUser.id
      )
    );

    return void interaction.reply(
      `${interaction.targetUser}, your **${pendingTitleTask.title}** title request was cancelled.`
    );
  },
});
