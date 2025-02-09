import Seo from "@/components/Seo";
import Layout from "@/components/layout/Layout";

export default function CommandsPage() {
  return (
    <Layout>
      <Seo templateTitle="Commands" />
      <main className="w-full text-white">
        <div className="container">
          <h1>Commands</h1>
          <p>
            These commands are currently available. Feel free to request new
            ones!
          </p>
          <table className="mx-auto mt-14 w-full table-auto border-separate border-spacing-2 self-center text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Options (? means optional)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>/cancel</td>
                <td>Cancel your title buff request</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Cancel Title Request</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/clear-stats</td>
                <td>Clear governor statistics</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/configure-title</td>
                <td>(Un)lock and set the timeout for title buffs</td>
                <td>title, ttl, locked</td>
              </tr>
              <tr>
                <td>/coords</td>
                <td>View or update your city coordinates</td>
                <td>view?, update?</td>
              </tr>
              <tr>
                <td>/export-stats</td>
                <td>Export statistics to an Excel file</td>
                <td>stats</td>
              </tr>
              <tr>
                <td>/kvk-leaderboard</td>
                <td>View the KvK leaderboard</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/link</td>
                <td>Link your Discord account to a governor profile</td>
                <td>id, type</td>
              </tr>
              <tr>
                <td>/new-kvk</td>
                <td>Start a new KvK</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/publish-stats</td>
                <td>Publish governor and KvK statistics</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/queue</td>
                <td>View the current title buff queue</td>
                <td>title?</td>
              </tr>
              <tr>
                <td>/reboot</td>
                <td>Reboot emulator with Rise of Kingdoms</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/scan</td>
                <td>Scan governor rankings statistics</td>
                <td>type, top</td>
              </tr>
              <tr>
                <td>/set-bot-state</td>
                <td>Pause or resume the bot</td>
                <td>state</td>
              </tr>
              <tr>
                <td>/set-user-coords</td>
                <td>Set the coordinates for a user</td>
                <td>kingdom, x-coordinate, y-coordinate, user</td>
              </tr>
              <tr>
                <td>/sinner-title</td>
                <td>Request a sinner title buff</td>
                <td>title, kingdom?, x-coordinate?, y-coordinate?</td>
              </tr>
              <tr>
                <td>/title</td>
                <td>Request a title buff</td>
                <td>title, kingdom?, x-coordinate?, y-coordinate?</td>
              </tr>
              <tr>
                <td>/verification</td>
                <td>Manually start a verification process</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>/view-stats</td>
                <td>View statistics</td>
                <td>stats, id?, type?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
