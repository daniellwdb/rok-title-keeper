import { ApplicationCommandType } from "discord.js";
import { createCommand } from "./util/create-command.js";
import { cancelledTitleTasks$, pendingTitleTasks$ } from "../queue.js";
import { config } from "../config.js";
import { interpolate } from "../util/interpolate.js";

export const cancelCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "cancel",
  description: "Cancel your title buff request",
  execute(interaction) {
    const pendingTitleTask = pendingTitleTasks$.value.find(
      (task) => task.discordUserId === interaction.user.id
    );

    if (!pendingTitleTask) {
      return void interaction.reply(config.NO_TITLE_REQUESTED);
    }

    cancelledTitleTasks$.next([
      ...cancelledTitleTasks$.value,
      interaction.user.id,
    ]);

    pendingTitleTasks$.next(
      pendingTitleTasks$.value.filter(
        (task) => task.discordUserId !== interaction.user.id
      )
    );

    return void interaction.reply(
      interpolate(config.TITLE_REQUEST_CANCELLED, {
        title: pendingTitleTask.title,
      })
    );
  },
});
