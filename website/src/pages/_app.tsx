import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.$discordMessage = {
      profiles: {
        daniell: {
          author: "Daniell",
          avatar: "https://github.com/daniellwdb.png",
          roleColor: "#b3aea0",
        },
        roka: {
          author: "Roka.",
          bot: true,
          avatar: "/images/roka.png",
        },
      },

      emojis: {
        diamond: {
          name: "white_check_mark",
          url: "/images/white_check_mark.svg",
        },
      },
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
