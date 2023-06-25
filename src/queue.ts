import type { Snowflake } from "discord.js";
import {
  EMPTY,
  Subject,
  catchError,
  concatMap,
  defer,
  filter,
  from,
  groupBy,
  map,
  merge,
  mergeMap,
  of,
  race,
  share,
  take,
  timer,
  switchMap,
  BehaviorSubject,
  tap,
} from "rxjs";
import { addTitle, type AddTitleOptions } from "./add-title.js";
import { Title } from "./types.js";

interface FetchTitleOptions extends AddTitleOptions {
  discordUserId: Snowflake;
  titleTtl: number;
}

enum TitleStatus {
  ADDED = "added",
  REMOVED = "removed",
}

const fetchTitle$$ = new Subject<FetchTitleOptions>();

export const requestTitle$ = new Subject<FetchTitleOptions>();
export const cancel$ = new Subject<{ discordUserId: Snowflake }>();

export const titleQueueCounts$ = new BehaviorSubject<
  Record<Title, Snowflake[]>
>({
  [Title.JUSTICE]: [],
  [Title.DUKE]: [],
  [Title.ARCHITECT]: [],
  [Title.SCIENTIST]: [],
});

export const titleRequestsQueue$ = fetchTitle$$.pipe(
  concatMap(({ discordUserId, ...addTitleOptions }) =>
    from(addTitle(addTitleOptions)).pipe(
      map(() => ({ error: undefined, discordUserId, success: true })),
      catchError((error: Error) => of({ error, discordUserId, success: false }))
    )
  ),
  share()
);

const fetchTitle$ = (fetchTitleOptions: FetchTitleOptions) =>
  merge(
    titleRequestsQueue$.pipe(
      filter(
        ({ discordUserId }) => discordUserId === fetchTitleOptions.discordUserId
      ),
      take(1)
    ),
    defer(() => {
      fetchTitle$$.next(fetchTitleOptions);

      return EMPTY;
    })
  );

requestTitle$
  .pipe(
    tap(({ title, discordUserId }) =>
      titleQueueCounts$.next({
        ...titleQueueCounts$.value,
        ...{ [title]: [...titleQueueCounts$.value[title], discordUserId] },
      })
    ),
    groupBy(({ title }) => title),
    mergeMap((group$) =>
      group$.pipe(
        concatMap((fetchTitleOptions) => {
          const title$ = fetchTitle$(fetchTitleOptions).pipe(
            map(
              ({ success }) =>
                ({
                  ...fetchTitleOptions,
                  success,
                  type: TitleStatus.ADDED,
                } as const)
            )
          );

          return title$.pipe(
            switchMap(({ success }) =>
              race(
                timer(success ? fetchTitleOptions.titleTtl * 1000 : 0),
                cancel$.pipe(
                  filter(
                    ({ discordUserId }) =>
                      discordUserId === fetchTitleOptions.discordUserId
                  ),
                  take(1)
                )
              ).pipe(
                tap(() =>
                  titleQueueCounts$.next({
                    ...titleQueueCounts$.value,
                    ...{
                      [fetchTitleOptions.title]: titleQueueCounts$.value[
                        fetchTitleOptions.title
                      ].filter(
                        (discordUserId) =>
                          discordUserId !== fetchTitleOptions.discordUserId
                      ),
                    },
                  })
                ),
                map(
                  () =>
                    ({
                      ...fetchTitleOptions,
                      type: TitleStatus.REMOVED,
                    } as const)
                )
              )
            ),
            catchError(() => EMPTY)
          );
        })
      )
    )
  )
  .subscribe();
