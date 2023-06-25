import convict, { type SchemaObj } from "convict";

export const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development"],
    default: "development",
    env: "NODE_ENV",
  },
  name: {
    doc: "The name of the application.",
    format: String,
    default: null,
    env: "npm_package_name",
  } as SchemaObj<string>,
  discord: {
    token: {
      doc: "The bot application token.",
      format: String,
      default: null,
      sensitive: true,
      env: "DISCORD_TOKEN",
    },
    guild: {
      doc: "The ID of the guild the bot application is used in.",
      format: String,
      default: null,
      env: "DISCORD_GUILD",
    } as SchemaObj<string>,
  },
  kingdom: {
    home: {
      doc: "The number of the home kingdom.",
      format: String,
      default: null,
      env: "HOME_KINGDOM",
    } as SchemaObj<string>,
    lost: {
      doc: "The number of the lost kingdom.",
      format: String,
      default: null,
      env: "LOST_KINGDOM",
    } as SchemaObj<string>,
  },
});

config.validate({ allowed: "strict" });
