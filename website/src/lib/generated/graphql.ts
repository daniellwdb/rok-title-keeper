import { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** columns and relationships of "governor_kvk_statistics" */
export type Governor_Kvk_Statistics = {
  __typename?: "governor_kvk_statistics";
  current_dkp: Scalars["String"]["output"];
  dead_difference: Scalars["String"]["output"];
  guild_id: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  nickname: Scalars["String"]["output"];
  percentage_towards_goal: Scalars["String"]["output"];
  power: Scalars["String"]["output"];
  power_difference: Scalars["String"]["output"];
  remaining_dkp: Scalars["String"]["output"];
  tier_4_kp_difference: Scalars["String"]["output"];
  tier_5_kp_difference: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "governor_kvk_statistics". All fields are combined with a logical 'AND'. */
export type Governor_Kvk_Statistics_Bool_Exp = {
  _and?: InputMaybe<Array<Governor_Kvk_Statistics_Bool_Exp>>;
  _not?: InputMaybe<Governor_Kvk_Statistics_Bool_Exp>;
  _or?: InputMaybe<Array<Governor_Kvk_Statistics_Bool_Exp>>;
  current_dkp?: InputMaybe<String_Comparison_Exp>;
  dead_difference?: InputMaybe<String_Comparison_Exp>;
  guild_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  percentage_towards_goal?: InputMaybe<String_Comparison_Exp>;
  power?: InputMaybe<String_Comparison_Exp>;
  power_difference?: InputMaybe<String_Comparison_Exp>;
  remaining_dkp?: InputMaybe<String_Comparison_Exp>;
  tier_4_kp_difference?: InputMaybe<String_Comparison_Exp>;
  tier_5_kp_difference?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "governor_kvk_statistics". */
export type Governor_Kvk_Statistics_Order_By = {
  current_dkp?: InputMaybe<Order_By>;
  dead_difference?: InputMaybe<Order_By>;
  guild_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  percentage_towards_goal?: InputMaybe<Order_By>;
  power?: InputMaybe<Order_By>;
  power_difference?: InputMaybe<Order_By>;
  remaining_dkp?: InputMaybe<Order_By>;
  tier_4_kp_difference?: InputMaybe<Order_By>;
  tier_5_kp_difference?: InputMaybe<Order_By>;
};

/** select columns of table "governor_kvk_statistics" */
export enum Governor_Kvk_Statistics_Select_Column {
  /** column name */
  CurrentDkp = "current_dkp",
  /** column name */
  DeadDifference = "dead_difference",
  /** column name */
  GuildId = "guild_id",
  /** column name */
  Id = "id",
  /** column name */
  Nickname = "nickname",
  /** column name */
  PercentageTowardsGoal = "percentage_towards_goal",
  /** column name */
  Power = "power",
  /** column name */
  PowerDifference = "power_difference",
  /** column name */
  RemainingDkp = "remaining_dkp",
  /** column name */
  Tier_4KpDifference = "tier_4_kp_difference",
  /** column name */
  Tier_5KpDifference = "tier_5_kp_difference",
}

/** Streaming cursor of the table "governor_kvk_statistics" */
export type Governor_Kvk_Statistics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Governor_Kvk_Statistics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Governor_Kvk_Statistics_Stream_Cursor_Value_Input = {
  current_dkp?: InputMaybe<Scalars["String"]["input"]>;
  dead_difference?: InputMaybe<Scalars["String"]["input"]>;
  guild_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  nickname?: InputMaybe<Scalars["String"]["input"]>;
  percentage_towards_goal?: InputMaybe<Scalars["String"]["input"]>;
  power?: InputMaybe<Scalars["String"]["input"]>;
  power_difference?: InputMaybe<Scalars["String"]["input"]>;
  remaining_dkp?: InputMaybe<Scalars["String"]["input"]>;
  tier_4_kp_difference?: InputMaybe<Scalars["String"]["input"]>;
  tier_5_kp_difference?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "governor_statistics" */
export type Governor_Statistics = {
  __typename?: "governor_statistics";
  dead: Scalars["String"]["output"];
  guild_id: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  kill_points: Scalars["String"]["output"];
  nickname: Scalars["String"]["output"];
  power: Scalars["String"]["output"];
  resource_assistance: Scalars["String"]["output"];
  tier_1_kills: Scalars["String"]["output"];
  tier_2_kills: Scalars["String"]["output"];
  tier_3_kills: Scalars["String"]["output"];
  tier_4_kills: Scalars["String"]["output"];
  tier_5_kills: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "governor_statistics". All fields are combined with a logical 'AND'. */
export type Governor_Statistics_Bool_Exp = {
  _and?: InputMaybe<Array<Governor_Statistics_Bool_Exp>>;
  _not?: InputMaybe<Governor_Statistics_Bool_Exp>;
  _or?: InputMaybe<Array<Governor_Statistics_Bool_Exp>>;
  dead?: InputMaybe<String_Comparison_Exp>;
  guild_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  kill_points?: InputMaybe<String_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  power?: InputMaybe<String_Comparison_Exp>;
  resource_assistance?: InputMaybe<String_Comparison_Exp>;
  tier_1_kills?: InputMaybe<String_Comparison_Exp>;
  tier_2_kills?: InputMaybe<String_Comparison_Exp>;
  tier_3_kills?: InputMaybe<String_Comparison_Exp>;
  tier_4_kills?: InputMaybe<String_Comparison_Exp>;
  tier_5_kills?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "governor_statistics". */
export type Governor_Statistics_Order_By = {
  dead?: InputMaybe<Order_By>;
  guild_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kill_points?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  power?: InputMaybe<Order_By>;
  resource_assistance?: InputMaybe<Order_By>;
  tier_1_kills?: InputMaybe<Order_By>;
  tier_2_kills?: InputMaybe<Order_By>;
  tier_3_kills?: InputMaybe<Order_By>;
  tier_4_kills?: InputMaybe<Order_By>;
  tier_5_kills?: InputMaybe<Order_By>;
};

/** select columns of table "governor_statistics" */
export enum Governor_Statistics_Select_Column {
  /** column name */
  Dead = "dead",
  /** column name */
  GuildId = "guild_id",
  /** column name */
  Id = "id",
  /** column name */
  KillPoints = "kill_points",
  /** column name */
  Nickname = "nickname",
  /** column name */
  Power = "power",
  /** column name */
  ResourceAssistance = "resource_assistance",
  /** column name */
  Tier_1Kills = "tier_1_kills",
  /** column name */
  Tier_2Kills = "tier_2_kills",
  /** column name */
  Tier_3Kills = "tier_3_kills",
  /** column name */
  Tier_4Kills = "tier_4_kills",
  /** column name */
  Tier_5Kills = "tier_5_kills",
}

/** Streaming cursor of the table "governor_statistics" */
export type Governor_Statistics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Governor_Statistics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Governor_Statistics_Stream_Cursor_Value_Input = {
  dead?: InputMaybe<Scalars["String"]["input"]>;
  guild_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  kill_points?: InputMaybe<Scalars["String"]["input"]>;
  nickname?: InputMaybe<Scalars["String"]["input"]>;
  power?: InputMaybe<Scalars["String"]["input"]>;
  resource_assistance?: InputMaybe<Scalars["String"]["input"]>;
  tier_1_kills?: InputMaybe<Scalars["String"]["input"]>;
  tier_2_kills?: InputMaybe<Scalars["String"]["input"]>;
  tier_3_kills?: InputMaybe<Scalars["String"]["input"]>;
  tier_4_kills?: InputMaybe<Scalars["String"]["input"]>;
  tier_5_kills?: InputMaybe<Scalars["String"]["input"]>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

export type Query_Root = {
  __typename?: "query_root";
  /** fetch data from the table: "governor_kvk_statistics" */
  governor_kvk_statistics: Array<Governor_Kvk_Statistics>;
  /** fetch data from the table: "governor_kvk_statistics" using primary key columns */
  governor_kvk_statistics_by_pk?: Maybe<Governor_Kvk_Statistics>;
  /** fetch data from the table: "governor_statistics" */
  governor_statistics: Array<Governor_Statistics>;
  /** fetch data from the table: "governor_statistics" using primary key columns */
  governor_statistics_by_pk?: Maybe<Governor_Statistics>;
};

export type Query_RootGovernor_Kvk_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Governor_Kvk_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Governor_Kvk_Statistics_Order_By>>;
  where?: InputMaybe<Governor_Kvk_Statistics_Bool_Exp>;
};

export type Query_RootGovernor_Kvk_Statistics_By_PkArgs = {
  guild_id: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type Query_RootGovernor_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Governor_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Governor_Statistics_Order_By>>;
  where?: InputMaybe<Governor_Statistics_Bool_Exp>;
};

export type Query_RootGovernor_Statistics_By_PkArgs = {
  guild_id: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** fetch data from the table: "governor_kvk_statistics" */
  governor_kvk_statistics: Array<Governor_Kvk_Statistics>;
  /** fetch data from the table: "governor_kvk_statistics" using primary key columns */
  governor_kvk_statistics_by_pk?: Maybe<Governor_Kvk_Statistics>;
  /** fetch data from the table in a streaming manner: "governor_kvk_statistics" */
  governor_kvk_statistics_stream: Array<Governor_Kvk_Statistics>;
  /** fetch data from the table: "governor_statistics" */
  governor_statistics: Array<Governor_Statistics>;
  /** fetch data from the table: "governor_statistics" using primary key columns */
  governor_statistics_by_pk?: Maybe<Governor_Statistics>;
  /** fetch data from the table in a streaming manner: "governor_statistics" */
  governor_statistics_stream: Array<Governor_Statistics>;
};

export type Subscription_RootGovernor_Kvk_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Governor_Kvk_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Governor_Kvk_Statistics_Order_By>>;
  where?: InputMaybe<Governor_Kvk_Statistics_Bool_Exp>;
};

export type Subscription_RootGovernor_Kvk_Statistics_By_PkArgs = {
  guild_id: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type Subscription_RootGovernor_Kvk_Statistics_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Governor_Kvk_Statistics_Stream_Cursor_Input>>;
  where?: InputMaybe<Governor_Kvk_Statistics_Bool_Exp>;
};

export type Subscription_RootGovernor_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Governor_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Governor_Statistics_Order_By>>;
  where?: InputMaybe<Governor_Statistics_Bool_Exp>;
};

export type Subscription_RootGovernor_Statistics_By_PkArgs = {
  guild_id: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type Subscription_RootGovernor_Statistics_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Governor_Statistics_Stream_Cursor_Input>>;
  where?: InputMaybe<Governor_Statistics_Bool_Exp>;
};

export type StatsByServerIdQueryVariables = Exact<{
  _eq?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type StatsByServerIdQuery = {
  __typename?: "query_root";
  governor_kvk_statistics: Array<{
    __typename?: "governor_kvk_statistics";
    id: string;
    nickname: string;
    power: string;
    power_difference: string;
    tier_4_kp_difference: string;
    tier_5_kp_difference: string;
    dead_difference: string;
    current_dkp: string;
    remaining_dkp: string;
    percentage_towards_goal: string;
  }>;
};

export const StatsByServerIdDocument = gql`
  query StatsByServerId($_eq: String = "") {
    governor_kvk_statistics(where: { guild_id: { _eq: $_eq } }) {
      id
      nickname
      power
      power_difference
      tier_4_kp_difference
      tier_5_kp_difference
      dead_difference
      current_dkp
      remaining_dkp
      percentage_towards_goal
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    StatsByServerId(
      variables?: StatsByServerIdQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<StatsByServerIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<StatsByServerIdQuery>(
            StatsByServerIdDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "StatsByServerId",
        "query",
        variables
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
