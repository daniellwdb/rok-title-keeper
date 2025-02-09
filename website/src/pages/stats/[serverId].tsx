import Seo from "@/components/Seo";
import Layout from "@/components/layout/Layout";
import { Governor_Kvk_Statistics, getSdk } from "@/lib/generated/graphql";
import { GetServerSideProps, NextPage } from "next";
import { GraphQLClient } from "graphql-request";
import abbreviate from "@pqt/abbreviate";

const client = new GraphQLClient(
  "https://healthy-bonefish-77.hasura.app/v1/graphql"
);

const sdk = getSdk(client);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.serverId !== "string") {
    return {
      notFound: true,
    };
  }

  const { governor_kvk_statistics } = await sdk.StatsByServerId({
    _eq: params.serverId,
  });

  return {
    props: {
      stats: governor_kvk_statistics,
    },
  };
};

const StatsPage: NextPage<{ stats: Governor_Kvk_Statistics[] }> = ({
  stats,
}) => {
  const power = stats.reduce(
    (acc, val) => acc + Number(val.power.replaceAll(",", "")),
    0
  );
  const tier4KillPoints = stats.reduce(
    (acc, val) => acc + Number(val.tier_4_kp_difference.replaceAll(",", "")),
    0
  );
  const tier5KillPoints = stats.reduce(
    (acc, val) => acc + Number(val.tier_5_kp_difference.replaceAll(",", "")),
    0
  );

  return (
    <Layout withBackgroundImage containerCentered={false} marginTop={0}>
      <Seo templateTitle="Statistics" />
      <main className="h-full">
        <section
          className="isolate w-full bg-black/75 text-white"
          style={{
            clipPath:
              "polygon(0 0,100% 0,100% calc(100% - 126.79px),calc(100% - 100px) calc(100% - 100px),calc(100% - 126.79px) 100%,126.79px 100%,100px calc(100% - 100px),0 calc(100% - 126.79px))",
          }}
        >
          <div className="container mx-auto flex flex-col items-center py-[5%]">
            <h1>KvK Summary</h1>
            <div className="flex w-full justify-between pt-10">
              <div>
                <p className="font-pj text-4xl font-bold xl:text-6xl">
                  {abbreviate(power, 1)}+
                </p>
                <p className="font-pj mt-2 text-base font-normal lg:text-xl">
                  Power
                </p>
              </div>

              <div>
                <p className="font-pj text-4xl font-bold xl:text-6xl">
                  {abbreviate(tier4KillPoints, 1)}+
                </p>
                <p className="font-pj mt-2 text-base font-normal lg:text-xl">
                  T4 Kills
                </p>
              </div>

              <div>
                <p className="font-pj text-4xl font-bold xl:text-6xl">
                  {abbreviate(tier5KillPoints, 1)}+
                </p>
                <p className="font-pj mt-2 text-base font-normal lg:text-xl">
                  T5 Kills
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[5%] text-white">
          <div className="container mx-auto flex flex-col items-center">
            <h1>Top 10 DKP</h1>

            <table className="mx-auto mt-14 w-full table-auto border-separate border-spacing-2 self-center text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Nickname</th>
                  <th>Power</th>
                  <th>T4 Kills</th>
                  <th>T5 Kills</th>
                  <th>Dead</th>
                  <th>DKP</th>
                  <th>Power difference</th>
                </tr>
              </thead>
              <tbody>
                {stats
                  .sort((a, b) => Number(b.current_dkp) - Number(a.current_dkp))
                  .slice(0, 10)
                  .map((stat, i) => (
                    <tr key={stat.id}>
                      <td>{i + 1}</td>
                      <td>{stat.id}</td>
                      <td>{stat.nickname}</td>
                      <td>
                        {abbreviate(Number(stat.power.replaceAll(",", "")), 1)}
                      </td>
                      <td>
                        {abbreviate(
                          Number(stat.tier_4_kp_difference.replaceAll(",", "")),
                          1
                        )}
                      </td>
                      <td>
                        {abbreviate(
                          Number(stat.tier_5_kp_difference.replaceAll(",", "")),
                          1
                        )}
                      </td>
                      <td>
                        {abbreviate(
                          Number(stat.dead_difference.replaceAll(",", "")),
                          1
                        )}
                      </td>
                      <td>{abbreviate(Number(stat.current_dkp), 1)}</td>
                      <td>
                        {abbreviate(
                          Number(stat.power_difference.replaceAll(",", "")),
                          1
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="isolate w-full bg-black/90 text-white"
          style={{
            clipPath:
              "polygon(0 126.79px,100px 100px,126.79px 0,calc(100% - 126.79px) 0,calc(100% - 100px) 100px,100% 126.79px,100% 100%,0 100%)",
          }}
        >
          <div className="container mx-auto flex flex-col items-center py-[5%]">
            <h1>Top 500 KvK (coming soon)</h1>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default StatsPage;
