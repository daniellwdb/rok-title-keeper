import {
  DiscordMessages,
  DiscordMessage,
  DiscordCommand,
  DiscordMention,
  DiscordEmbed,
  DiscordEmbedFooter,
  DiscordAttachments,
  DiscordActionRow,
  DiscordButton,
} from "@skyra/discord-components-react";
import { ReactNode } from "react";

interface TitleRequestProps {
  children?: ReactNode;
  queueCount?: number;
  showRequestedTitleReply?: boolean;
}

export function TitleRequest({
  children,
  queueCount = 1,
  showRequestedTitleReply = true,
}: TitleRequestProps) {
  return (
    <DiscordMessages className="rounded-lg">
      <DiscordMessage profile="roka">
        <DiscordCommand slot="reply" profile="daniell" command="/title" />
        You requested the Duke title. Your position in the queue is:{" "}
        {queueCount}
      </DiscordMessage>
      {children}
      {showRequestedTitleReply && (
        <DiscordMessage profile="roka">
          <DiscordMention highlight>Daniell,</DiscordMention> you received the
          Duke title for 180 seconds. Please press &quot;Done&quot; when{" "}
          {"you're"} finished.
          <DiscordEmbed
            slot="embeds"
            color="#fff"
            embedTitle="Duke title requested by Daniell"
            image="/images/screenshot.webp"
          >
            <DiscordEmbedFooter slot="footer">
              📍 Home kingdom @625, 570
            </DiscordEmbedFooter>
          </DiscordEmbed>
          <DiscordAttachments slot="components">
            <DiscordActionRow>
              <DiscordButton
                type="success"
                emoji="white_check_mark"
                emojiName="✅"
              >
                Done
              </DiscordButton>
            </DiscordActionRow>
          </DiscordAttachments>
        </DiscordMessage>
      )}
    </DiscordMessages>
  );
}
