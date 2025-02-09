import {
  Subject,
  catchError,
  from,
  map,
  of,
  concatMap,
  defer,
  tap,
  mergeMap,
  switchMap,
  race,
  groupBy,
  timer,
  BehaviorSubject,
  first,
  merge,
  EMPTY,
  filter,
  share,
} from "rxjs";
import type { AppContext } from "./types.js";
import { scan } from "./scan.js";
import type { Client, Snowflake } from "discord.js";
import { title } from "./title.js";
import { type Worker } from "tesseract.js";
import type { GovernorRankings, SinnerTitle, Title } from "./constants.js";
import { reboot } from "./reboot.js";
import { config } from "./config.js";

export enum TaskType {
  SCAN = "scan",
  TITLE = "title",
  REBOOT = "reboot",
}

export type Task = AppContext &
  (
    | {
        type: TaskType.SCAN;
        discordUserId: Snowflake;
        rankingsType: GovernorRankings;
        top: number;
        worker: Worker;
      }
    | {
        type: TaskType.TITLE;
        discordUserId: Snowflake;
        kingdomId: string;
        title: Title | SinnerTitle;
        x: number;
        y: number;
        ttl: number;
      }
    | {
        type: TaskType.REBOOT;
        discordUserId: Snowflake | "system";
        client: Client;
      }
  );

type TaskResult = Task &
  (
    | { success: true; error: undefined; discordUserId: Snowflake }
    | { success: false; error: unknown; discordUserId: Snowflake }
  );

export const queue$ = new Subject<Task>();
export const cancelTitleTimer$ = new Subject<Snowflake>();
export const cancelledTitleTasks$ = new BehaviorSubject<Snowflake[]>([]);

export const pendingTitleTasks$ = new BehaviorSubject<
  Array<Extract<Task, { type: TaskType.TITLE }>>
>([]);

export const rebootTaskPending$ = new BehaviorSubject<boolean>(false);

const pendingTasks$ = new Subject<Task>();

export const tasks$ = pendingTasks$.pipe(
  concatMap((task) =>
    defer(() => {
      const hasCancelledTitleTask = cancelledTitleTasks$.value.some(
        (discordUserId) => discordUserId === task.discordUserId
      );

      if (hasCancelledTitleTask) {
        cancelledTitleTasks$.next(
          cancelledTitleTasks$.value.filter(
            (discordUserId) => discordUserId !== task.discordUserId
          )
        );

        throw new Error("Title request cancelled.");
      }

      return from(
        task.type === TaskType.SCAN
          ? scan(task)
          : task.type === TaskType.TITLE
          ? title(task)
          : reboot(task)
      );
    }).pipe(
      map(
        () =>
          ({
            success: true,
            error: undefined,
            ...task,
          } satisfies TaskResult)
      ),
      catchError((error) => of({ success: false, error, ...task }))
    )
  ),
  share()
);

const startTask$ = (task: Task) =>
  merge(
    tasks$.pipe(
      first(
        ({ discordUserId, type }) =>
          type === task.type && discordUserId === task.discordUserId
      )
    ),
    defer(() => {
      pendingTasks$.next(task);

      return EMPTY;
    })
  );

const titleTasks$ = queue$.pipe(
  filter(
    (task): task is Extract<Task, { type: TaskType.TITLE }> =>
      task.type === TaskType.TITLE
  )
);

const scanTasks$ = queue$.pipe(
  filter(
    (task): task is Extract<Task, { type: TaskType.SCAN }> =>
      task.type === TaskType.SCAN
  )
);

const rebootTasks$ = queue$.pipe(
  filter(
    (task): task is Extract<Task, { type: TaskType.REBOOT }> =>
      task.type === TaskType.REBOOT
  )
);

const title$ = titleTasks$.pipe(
  tap((task) => pendingTitleTasks$.next([...pendingTitleTasks$.value, task])),
  groupBy(({ title }) => title),
  mergeMap((group$) =>
    group$.pipe(
      concatMap((task) =>
        startTask$(task).pipe(
          switchMap((taskResult) =>
            race(
              timer(taskResult.success ? task.ttl * 1000 : 0),
              cancelTitleTimer$.pipe(
                first(
                  (discordUserId) => discordUserId === taskResult.discordUserId
                )
              )
            ).pipe(
              tap(() =>
                pendingTitleTasks$.next(
                  pendingTitleTasks$.value.filter(
                    (task) => task.discordUserId !== taskResult.discordUserId
                  )
                )
              ),
              map(() => taskResult)
            )
          )
        )
      )
    )
  )
);

const scan$ = scanTasks$.pipe(concatMap(startTask$));

const reboot$ = rebootTasks$.pipe(
  tap(() => rebootTaskPending$.next(true)),
  concatMap(startTask$),
  tap(() => rebootTaskPending$.next(false))
);

merge(title$, scan$, reboot$).subscribe((taskResult) => {
  if (taskResult.success) {
    return taskResult.logger.info(`Successfully finished: ${taskResult.type}.`);
  }

  if (!taskResult.error.message.includes("cancelled")) {
    taskResult.logger.error(
      `Failed ${taskResult.type}. Please include a screenshot of the error and the screenshot sent by the bot when reporting an issue. ${taskResult.error} (Animation delay: ${config.ANIMATION_DELAY})`
    );
  }
});
