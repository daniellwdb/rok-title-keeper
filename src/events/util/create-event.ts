import { type ClientEvents, type Awaitable } from "discord.js";
import type { AppContext } from "../../types.js";

interface Event<T extends keyof ClientEvents> {
  name: T;
  execute: (
    ...args: [...args: ClientEvents[T], context: AppContext]
  ) => Awaitable<void>;
}

export function createEvent<T extends keyof ClientEvents>(event: Event<T>) {
  return event;
}
